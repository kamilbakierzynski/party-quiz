import client from "../config/redisClient";

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
  ["Której części ciała mógłbyś/mogłabyś się pozbyć?", "Rąk", "Nóg", "Oczy", "Narządów rozrodczych"],
  ["Które z wymienionych jest dla ciebie największą abstrakcją?", "Czas", "Śmierć", "Nieskończoność", "Rozmiar wszechświata"],
  ["Która z sytuacji nabardziej cię przeraża?", "Nietoperz wplątany we włosy", "Mysz pod kołdrą", "Długi czarny włos w zupie", "Zauważenie pleśni po zjedzeniu połowy kanapki"],
  ["Otrzymujesz spadek w wysokości 5 milionów złotych po dalekim krewnym. Czy odtąd twoje życie będzie szczęśliwsze?", "Oczywiście", "Wcale", "Będzie takie samo", "Będzie gorsze"],
  ["Kto jest lepszym kierowcą?", "Mężczyźni", "Kobiety", "Nie ma reguły", "Na pewno nie kobiety"],
  ["Gdybyś mógł/mogła urodzić się w innej epoce, byłoby to:", "około 300 lat temu", "Około 1000 lat temu", "Około 2000 lat temu", "Około 5000 lat temu"],
  ["Czy wiesz, jakiego koloru bieliznę masz w tej chwili na sobie?", "Oczywiście", "Chyba tak", "Nie mam pojęcia", "Nie mam bielizny"],
  ["Co cię najlepiej odpręża?", "Słuchanie muzyki", "Dobra książka", "Spacer", "Granie w gry"],
  ["Dokąd najbardziej chciałbyś/chciałabyś wyskoczyć na zakupy w czasie posezonowych wyprzedaży?", "Do Paryża", "Do Nowego Jorku", "Do Mediolanu", "Do Tokio"],
  ["Czy jesteś dumny/dumna z tego, co dotąd udało ci się osiągnąć w życiu?"],
  ["Powołano cię do reprezentacji Polski w piłce nożnej. Na jakiej pozycji zagrasz?", "Na bramce", "Usiądę na ławce rezerwowych", "Będę trenerem", "W ataku"],
  ["Czy chciałbyś/chciałabyś być wyższy/wyższa?", "Tak, znacznie", "Tylko trochę", "Bez zmian", "Nawet niższy/niższa"],
  ["Które z wymienionych zwierząt są, według ciebie, najdziwniejsze?", "Nietoperze", "Mrówkojady", "Leniwce", "Kangury"],
  ["Dzwoni twój telefon - to policja. Co się dzieje z twoim samopoczuciem?", "Zaczynam panikować", "Lekki niepokój", "Pełen luz", "W pośpiechu wyrzucam zawartość szafy"],
  ["Który dźwięk najbardziej cię denerwuje?", "Nieznajomy gadający przez komórkę", "Ludzie rozmawiający w kinie", "Sąsiedzi w nocy za ścianą", "Samoloty latające nad miastem"],
  ["Co, twoim zdaniem, ma największy wpływ na to, kim jesteś?", "Geny", "Środowisko", "Szkoła", "Rodzina"],
  ["Czy lubisz występować publicznie?", "Kocham to", "Lubię", "Nie przeszkadza mi to", "Nienawidzę"],
  ["Które imię dałbyś/dałabyś swojej córce?", "Zofia", "Natalia", "Paulina", "Krystyna"],
  ["Jaka kwota przekonałaby cię do ogolenia się na łyso?", "200 zł", "500 zł", "2000 zł", "Więcej niż 10 000 zł"],
  ["W którym filmie jest Ci najłatwiej wyobrazić siebie w roli głównej?", "Piraci z karaibów", "Rejs", "Titanic", "Wilk z Wall Street"],
  ["Czy ludzkość byłaby lepsza, gdyby nie było religii?", "Zdecydowanie tak", "To bardzo możliwe", "Raczej nie", "Zdecydowanie nie"],
  ["Jak bardzo boisz się śmierci?", "Bardzo", "Średnio", "Staram się o tym nie myśleć", "Nie boję się"],
  ["Czy zrobiłeś/zrobiłaś w swoim życiu rzeczy, których naprawdę żałujesz?", "Łatwiej wymienić te, których nie żałuję", "Co najmniej kilka", "Jest taka jedna rzecz.", "Niczego nie żałuję"],
  ["Jak myślisz, gdzie będziesz mieszkać za dziesięć lat?", "W wielkim mieście", "Na przedmieściach", "Na wsi", "Z rodzicami"],
  ["Z czym kojarzy ci się jedno z najlepszych wspomnień?", "Z domem", "Z przyjęciem", "Z koncertem", "Z pierwszą miłością"],
  ["Z czego mógłbyś/mogłabyś zrezygnować?", "Rozmawiania przez telefon", "Wysyłania emaili", "Sprawdzania pogody", "Notowania w kalendarzu"],
  ["Dostajesz cztery interesujące propozycje. Możesz wybrać tylko jedną z nich.", "5 000 000 zł w gotówce", "Przeżycie w zdrowiu do 100 lat", "Zlikwidowanie głodu na całej Ziemi na 10 lat", "Posada prezydenta kraju"],
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

export const populateSetWithQuestions = async (gameId) => {
  await client.sadd(`questions-${gameId}`, ...questions.map(JSON.stringify));
  await client.expire(`questions-${gameId}`, 3600)
}

export const questions = questionsList.map(questionFactory);
