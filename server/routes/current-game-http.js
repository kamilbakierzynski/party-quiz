import express from "express";
import client from "../config/redisClient";
import { sendGameState } from "./current-game";
import _ from "lodash";
import { populateSetWithQuestions } from "../game/questionsList";
import playersKeyFormatter from "../helpers/keyFormatters/players";
import gameKeyFormatter from "../helpers/keyFormatters/games";
import questionsKeyFormatter from "../helpers/keyFormatters/questions";
import { INITIAL_PLAYER_SCORE, KEY_EXPIRATION, SKIP_QUESTION_PENALTY } from "../config/gameConfig";

const router = express.Router({ mergeParams: true });

const readGame = async (idGame) => {
  const gameKey = gameKeyFormatter(idGame);
  const response = await client.get(gameKey);
  const format = await {
    ...JSON.parse(response),
    joinedPlayers: await client.lrange(
      playersKeyFormatter(idGame),
      0,
      await client.llen(playersKeyFormatter(idGame))
    ),
  };
  return {
    ...format,
    joinedPlayers: format.joinedPlayers.map((player) => JSON.parse(player)),
  };
};

const saveChanges = async (idGame, game) => {
  const gameKey = gameKeyFormatter(idGame);
  await client.setex(
    gameKey,
    KEY_EXPIRATION,
    JSON.stringify(game)
  );
  sendGameState(idGame);
  return;
};

router.post("/:idGame/start-game", async (req, res) => {
  const { idGame } = req.params;
  const game = await readGame(idGame);
  const questionToAsk = await client.spop(questionsKeyFormatter(idGame));
  const newGameState = {
    scores: game.joinedPlayers.map((user) => ({ user, score: INITIAL_PLAYER_SCORE })),
    question: {
      ...JSON.parse(questionToAsk),
      user_asked: game.joinedPlayers[0],
    },
  };
  const startedGame = { ...game, started: true, state: newGameState };
  await saveChanges(idGame, startedGame);
  return res.send({});
});

router.post("/:idGame/answer-question", async (req, res) => {
  const { key } = req.body;
  const { idGame } = req.params;
  const game = await readGame(idGame);
  const updatedGameState = {
    ...game.state,
    question: {
      ...game.state.question,
      user_answer: game.state.question.possible_answers.find(
        (answer) => answer.key === key
      ),
    },
  };
  await saveChanges(idGame, { ...game, state: updatedGameState });
  return res.send({});
});

router.post("/:idGame/bet-answer", async (req, res) => {
  const { key, bet, user } = req.body;
  const { idGame } = req.params;
  const game = await readGame(idGame);
  const newBet = {
    user,
    answer: game.state.question.possible_answers.find(
      (answer) => answer.key === key
    ),
    bet,
  };
  const updatedGameState = {
    ...game.state,
    bets: [...(game.state.bets || []), newBet],
  };
  if (game.joinedPlayers.length - 1 === (updatedGameState.bets || []).length) {
    let countAnswered = 0;
    const newScores = updatedGameState.bets.reduce((akum, bet) => {
      const score = game.state.scores.find(
        (score) => score.user.id === bet.user.id
      );
      const correctAnswer =
        bet.answer.key === game.state.question.user_answer.key;
      if (correctAnswer) {
        countAnswered += 1;
      }
      const updatedScore = correctAnswer
        ? { ...score, score: score.score + bet.bet * bet.bet }
        : { ...score, score: score.score - bet.bet };
      return [...akum, updatedScore];
    }, []);
    const askedPlayerScore = game.state.scores.find(
      (score) => score.user.id === game.state.question.user_asked.id
    );
    const updatedAskedPlayerScore = {
      ...askedPlayerScore,
      score: askedPlayerScore.score + countAnswered,
    };
    const updatedScore = {
      ...updatedGameState,
      scores: [...newScores, updatedAskedPlayerScore],
    };
    await saveChanges(idGame, { ...game, state: updatedScore });
    return res.send({});
  }
  await saveChanges(idGame, { ...game, state: updatedGameState });
  return res.send({});
});

router.post("/:idGame/next-question", async (req, res) => {
  const { idGame } = req.params;
  const game = await readGame(idGame);
  if ((await client.scard(questionsKeyFormatter(idGame))) === 0) {
    populateSetWithQuestions(idGame);
  }
  const questionToAsk = await client.spop(questionsKeyFormatter(idGame));
  const playerIndex = _.indexOf(
    game.joinedPlayers.map((user) => user.id),
    game.state.question.user_asked.id
  );
  const nextPlayerIndex =
    playerIndex + 1 >= game.joinedPlayers.length ? 0 : playerIndex + 1;

  const newQuestionState = {
    ...game.state,
    question: {
      ...JSON.parse(questionToAsk),
      user_asked: game.joinedPlayers[nextPlayerIndex],
    },
    bets: undefined,
  };
  await saveChanges(idGame, { ...game, state: newQuestionState });
  return res.send({});
});

router.post("/:idGame/skip-question", async (req, res) => {
  const { idGame } = req.params;
  const game = await readGame(idGame);
  if ((await client.scard(questionsKeyFormatter(idGame))) === 0) {
    populateSetWithQuestions(idGame);
  }
  const questionToAsk = await client.spop(questionsKeyFormatter(idGame));
  const askedPlayerScore = game.state.scores.find(
    (score) => score.user.id === game.state.question.user_asked.id
  );
  const updatedAskedPlayerScore = {
    ...askedPlayerScore,
    score: askedPlayerScore.score - SKIP_QUESTION_PENALTY,
  };
  const updatedScore = {
    ...game.state,
    scores: [
      ...game.state.scores.filter(
        (score) => score.user.id !== game.state.question.user_asked.id
      ),
      updatedAskedPlayerScore,
    ],
  };
  const playerIndex = _.indexOf(
    game.joinedPlayers.map((player) => player.id),
    game.state.question.user_asked.id
  );
  const nextPlayerIndex =
    playerIndex + 1 >= game.joinedPlayers.length ? 0 : playerIndex + 1;

  const newQuestionState = {
    ...updatedScore,
    question: {
      ...JSON.parse(questionToAsk),
      user_asked: game.joinedPlayers[nextPlayerIndex],
    },
  };

  await saveChanges(req.params.idGame, { ...game, state: newQuestionState });
  return res.send({});
});

export default router;
