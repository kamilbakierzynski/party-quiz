const questionsList = [
  [
    "Który sport jest najszlachetniejszy?",
    "Karate",
    "Wyścigi konne",
    "Szermierka",
    "Tenis",
  ],
  [
    "Jak ci idzie opowiadanie dowcipów?",
    "Doskonale",
    "Czasami coś powiem dobrego",
    "Nie jest źle",
    "Zawszę spalę",
  ],
  [
    "Bardzo atrakcyjny przedstawiciel płci przeciwnej klepie cię po tyłku. Jak reagujesz?",
    "Wpadam w szał",
    "Udaję, że nic się nie stało",
    "Zwracam uwagę",
    "Zapraszam do domu na kolację",
  ],
  [
    "Ilu członków zespołu The Beatles potrafisz wymienić?",
    "Żadnego",
    "Jednego lub dwóch",
    "Trzech",
    "Całą czwórkę",
  ],
  [
    "Czy często mówisz rzeczy, których potem żałujesz?",
    "Prawie zawsze",
    "Niezbyt często",
    "Od czasu do czasu",
    "Bardzo rzadko",
  ],
  [
    "Ile znasz gatunków sera?",
    "Trzy lub mniej",
    "Cztery lub pięć",
    "Sześć lub siedem",
    "Osiem i więcej",
  ],
  [
    "Komu zazdrościsz najbardziej?",
    "Bogatym",
    "Mądrym",
    "Atrakcyjnym",
    "Sławnym",
  ],
  [
    "Czy Ziemię odwiedzą kiedyś przybysze z kosmosu?",
    "Zdecydowanie tak.",
    "Jest to prawdopodobne.",
    "Wątpię.",
    "A Ziemia jest płaska.",
  ],
  [
    "Który posiłek w ciągu dnia jest dla ciebie najważniejszy?",
    "Śniadanie",
    "Obiad",
    "Podwieczorek",
    "Kolacja",
  ],
  [
    "Jak dobrze posługujesz się chińskimi pałeczkami?",
    "Doskonale",
    "Całkiem nieźle",
    "Tak sobie",
    "Wolę widelec",
  ],
  [
    "W czym wolałbyś osiągnąć mistrzostwo?",
    "W grze w golfa",
    "W grze w pokera",
    "W grze na gitarze",
    "W malowaniu",
  ],
  [
    "Czy komukolwiek z grających jesteś winien/winna jakieś przeprosiny?",
    "Wszystkim",
    "Tak mi się wydaje",
    "To możliwe",
    "Raczej nie",
  ],
  [
    "Co jest najgorsze?",
    "Bycie nieszczerym",
    "Bycie naiwnym",
    "Bycie nieodpowiedzialnym",
    "Bycie niecierpliwym",
  ],
  [
    "Jaki rodzaj śmierci najmniej cię przeraża?",
    "Zakopanie żywcem",
    "Rozbicie samolotu",
    "Zjedzenie przez rekiny",
    "Nieleczona choroba",
  ],
  [
    "Jak wiele ofiarowujesz na cele charytatywne?",
    "Więcej niż inni",
    "Tyle, że czuję się dobrze",
    "Mniej niż mogę",
    "Nic",
  ],
  [
    "Kto według ciebie najlepiej całuje?",
    "Ja, oczywiście",
    "Gracz po mojej lewej",
    "Gracz po mojej prawej",
    "Nikt z nas",
  ],
  [
    "Czy twój rząd wystarczająco wspier najbiedniejszych?",
    "Bardziej niż to potrzebne",
    "Wystarczająco",
    "W sam raz",
    "Za mało",
  ],
  [
    "Jaki jest twój poziom odporności na ból?",
    "Nie czuję bólu",
    "Powyżej średniej",
    "Przeciętny",
    "Bardzo niski",
  ],
];

const questionFactory = ([text, answer1, answer2, answer3, answer4]) => {
  return {
    text,
    possible_answers: [
      { key: "0", text: answer1 },
      { key: "1", text: answer2 },
      { key: "2", text: answer3 },
      { key: "3", text: answer4 },
    ],
  };
};

export const questions = questionsList.map(questionFactory);
