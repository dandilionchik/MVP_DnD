import { useMemo, useState } from "react";
import {
  BellPlus,
  BookMarked,
  BookOpenCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  Link2,
  MapPinned,
  Pin,
  Plus,
  Search,
  ShieldPlus,
  Upload,
  UserPlus,
  Users,
  WandSparkles,
  X,
} from "lucide-react";
import { Layout } from "./components/Layout";
import {
  AvatarStack,
  GlassCard,
  ProgressBar,
  SectionTitle,
  StatPill,
  Tag,
} from "./components/Shared";
import {
  analyticsData,
  campaignsData,
  dmNotes,
  notifications,
  playerCharacters,
  userProfile,
  worldNotes,
} from "./data/mockData";

const defaultPageByRole = {
  player: "dashboard",
  dm: "dashboard",
};

const DND_CLASSES = [
  {
    name: "Barbarian",
    ru: "Варвар",
    hitDie: 12,
    fixedHp: 7,
    description: "Фронтовой боец с высоким запасом здоровья, яростью и устойчивостью к урону.",
    quickStats: { СИЛ: 15, ЛОВ: 13, ВЫН: 14, ИНТ: 8, МДР: 10, ХАР: 10 },
  },
  {
    name: "Bard",
    ru: "Бард",
    hitDie: 8,
    fixedHp: 5,
    description: "Универсальный герой поддержки, влияющий на сцену через харизму, магию и знания.",
    quickStats: { СИЛ: 8, ЛОВ: 13, ВЫН: 12, ИНТ: 10, МДР: 10, ХАР: 15 },
  },
  {
    name: "Cleric",
    ru: "Клирик",
    hitDie: 8,
    fixedHp: 5,
    description: "Заклинатель божественной магии с лечением, защитой и сильными утилитарными эффектами.",
    quickStats: { СИЛ: 12, ЛОВ: 10, ВЫН: 13, ИНТ: 10, МДР: 15, ХАР: 10 },
  },
  {
    name: "Druid",
    ru: "Друид",
    hitDie: 8,
    fixedHp: 5,
    description: "Заклинатель природы с контролем поля боя, формами зверя и полезной разведкой.",
    quickStats: { СИЛ: 8, ЛОВ: 12, ВЫН: 13, ИНТ: 10, МДР: 15, ХАР: 10 },
  },
  {
    name: "Fighter",
    ru: "Воин",
    hitDie: 10,
    fixedHp: 6,
    description: "Гибкий класс для боя в ближнем или дальнем бою, хорошо масштабируется от выбора стиля.",
    quickStats: { СИЛ: 15, ЛОВ: 12, ВЫН: 14, ИНТ: 10, МДР: 10, ХАР: 8 },
  },
  {
    name: "Monk",
    ru: "Монах",
    hitDie: 8,
    fixedHp: 5,
    description: "Мобильный боец, опирающийся на ки, скорость, реакцию и комбинации ударов.",
    quickStats: { СИЛ: 8, ЛОВ: 15, ВЫН: 13, ИНТ: 10, МДР: 14, ХАР: 8 },
  },
  {
    name: "Paladin",
    ru: "Паладин",
    hitDie: 10,
    fixedHp: 6,
    description: "Защитник партии с высокой стойкостью, аурами и взрывным уроном через кары.",
    quickStats: { СИЛ: 15, ЛОВ: 10, ВЫН: 13, ИНТ: 8, МДР: 10, ХАР: 14 },
  },
  {
    name: "Ranger",
    ru: "Следопыт",
    hitDie: 10,
    fixedHp: 6,
    description: "Разведчик и охотник с навыками выживания, меткостью и природной магией.",
    quickStats: { СИЛ: 10, ЛОВ: 15, ВЫН: 13, ИНТ: 10, МДР: 14, ХАР: 8 },
  },
  {
    name: "Rogue",
    ru: "Плут",
    hitDie: 8,
    fixedHp: 5,
    description: "Специалист по скрытности, ловушкам и точечному урону через скрытую атаку.",
    quickStats: { СИЛ: 8, ЛОВ: 15, ВЫН: 12, ИНТ: 13, МДР: 10, ХАР: 14 },
  },
  {
    name: "Sorcerer",
    ru: "Чародей",
    hitDie: 6,
    fixedHp: 4,
    description: "Маг с врождённой силой и метамагией, позволяющей гибко применять заклинания.",
    quickStats: { СИЛ: 8, ЛОВ: 12, ВЫН: 13, ИНТ: 10, МДР: 10, ХАР: 15 },
  },
  {
    name: "Warlock",
    ru: "Колдун",
    hitDie: 8,
    fixedHp: 5,
    description: "Заклинатель с пактом, сильными короткими ресурсами и настраиваемыми инвокациями.",
    quickStats: { СИЛ: 8, ЛОВ: 12, ВЫН: 13, ИНТ: 10, МДР: 10, ХАР: 15 },
  },
  {
    name: "Wizard",
    ru: "Волшебник",
    hitDie: 6,
    fixedHp: 4,
    description: "Самый гибкий академический заклинатель с широкой книгой заклинаний и контролем сцены.",
    quickStats: { СИЛ: 8, ЛОВ: 12, ВЫН: 13, ИНТ: 15, МДР: 10, ХАР: 10 },
  },
];

const RACES = [
  { name: "Human", ru: "Человек", description: "Гибкий универсальный выбор с адаптивной историей и любой ролью в партии." },
  { name: "Elf", ru: "Эльф", description: "Ловкие и внимательные герои с сильной связью с магией и природой." },
  { name: "Dwarf", ru: "Дварф", description: "Выносливые и надёжные персонажи, особенно хороши в фронтовых ролях." },
  { name: "Halfling", ru: "Полурослик", description: "Небольшие, удачливые и скрытные персонажи с отличной манёвренностью." },
  { name: "Tiefling", ru: "Тифлинг", description: "Харизматичные герои с инфернальным наследием и яркой визуальной идентичностью." },
  { name: "Dragonborn", ru: "Драконорождённый", description: "Гордые воители с драконьим наследием и дыхательной атакой." },
  { name: "Half-Elf", ru: "Полуэльф", description: "Социально сильные персонажи, сочетающие гибкость и харизму." },
  { name: "Half-Orc", ru: "Полуорк", description: "Мощные, стойкие бойцы с ярким боевым присутствием." },
  { name: "Gnome", ru: "Гном", description: "Любознательные, умные и магически устойчивые герои." },
];

const LANGUAGES = [
  "Общий",
  "Эльфийский",
  "Дварфийский",
  "Орочий",
  "Драконий",
  "Гномий",
  "Небесный",
  "Инфернальный",
  "Гоблинский",
  "Подземный",
];

const ALIGNMENTS = [
  { name: "Lawful Good", ru: "Законопослушно-добрый", description: "Следует принципам и помогает другим, даже если это требует личной жертвы." },
  { name: "Neutral Good", ru: "Нейтрально-добрый", description: "Ставит добро выше систем и правил, действует по совести." },
  { name: "Chaotic Good", ru: "Хаотично-добрый", description: "Защищает добро, но не любит ограничения и жёсткие рамки." },
  { name: "Lawful Neutral", ru: "Законопослушно-нейтральный", description: "Опирается на порядок, долг и стабильность как основу решений." },
  { name: "True Neutral", ru: "Истинно-нейтральный", description: "Стремится к балансу, прагматичности и выживанию без крайностей." },
  { name: "Chaotic Neutral", ru: "Хаотично-нейтральный", description: "Ценит свободу выбора и действует прежде всего из личного импульса." },
  { name: "Lawful Evil", ru: "Законопослушно-злой", description: "Использует систему, власть и правила ради своей выгоды." },
  { name: "Neutral Evil", ru: "Нейтрально-злой", description: "Эгоистичен и безжалостен, если это приближает цель." },
  { name: "Chaotic Evil", ru: "Хаотично-злой", description: "Разрушителен, импульсивен и склонен к насилию без уважения к порядку." },
];

const FEATS = [
  { name: "Наблюдатель", description: "Усиливает внимательность, чтение по губам и пассивное восприятие." },
  { name: "Лидер вдохновения", description: "Даёт группе временные HP перед опасной сценой." },
  { name: "Воитель с древковым оружием", description: "Улучшает контроль дистанции и реакции в ближнем бою." },
  { name: "Меткий стрелок", description: "Сильный выбор для дистанционного урона и агрессивной игры." },
  { name: "Ритуальный заклинатель", description: "Добавляет утилитарную магию и исследовательские инструменты." },
];

const EQUIPMENT_PACKS = [
  {
    name: "Боевой комплект",
    items: ["Основное оружие", "Щит", "Плащ", "Набор путешественника"],
  },
  {
    name: "Разведчик",
    items: ["Лёгкое оружие", "Лук", "Верёвка", "Набор следопыта"],
  },
  {
    name: "Арканист",
    items: ["Фокус", "Книга заклинаний", "Компоненты", "Походный дневник"],
  },
];

const BACKGROUND_PRESETS = [
  "Сирота, переживший падение родного дома и вынужденный рано повзрослеть.",
  "Бывший член ордена, ушедший после конфликта с наставником.",
  "Странник из другого королевства, ищущий утраченный артефакт семьи.",
  "Придворный агент, скрывающий настоящую лояльность и прошлую миссию.",
];

const AI_STORIES = [
  "Твоя семья исчезла во время ночного перехода через границу другого королевства. С тех пор персонаж собирает обрывки слухов, письма и старые карты, пытаясь понять, было ли это нападение, политическая чистка или магическая катастрофа. Эта потеря научила его не доверять официальным версиям событий и искать правду в скрытых деталях.",
  "После крушения дома и долгих лет изгнания персонаж научился выживать среди чужих людей, принимая разные роли и пряча настоящее имя. Теперь он идёт за собственным сюжетом: вернуть утраченное, раскрыть старый заговор и доказать, что судьба семьи не была случайностью.",
  "История началась как личная трагедия, но постепенно превратилась в путь героя, который связывает разрозненные судьбы, потерянные клятвы и забытые земли. Персонаж по-прежнему носит в себе боль утраты, но именно она делает его внимательным к чужим историям и даёт мотивацию доводить дело до конца.",
];

const SKILL_INFO = {
  "Акробатика": {
    ability: "Ловкость",
    description: "Манёвренность, удержание равновесия и контроль тела в движении.",
    example: "Перепрыгнуть через пролом или удержаться на скользком мосту.",
  },
  "Атлетика": {
    ability: "Сила",
    description: "Физическая мощь, лазание, прыжки и борьба с сопротивлением среды.",
    example: "Взломать дверь плечом или подтянуться на выступ.",
  },
  "Восприятие": {
    ability: "Мудрость",
    description: "Замечать звуки, ловушки, следы, движение и детали вокруг.",
    example: "Услышать шаги за дверью или заметить тайный механизм.",
  },
  "Выживание": {
    ability: "Мудрость",
    description: "Ориентирование, поиск следов, добыча ресурсов и жизнь в дикой местности.",
    example: "Найти безопасный путь через болото или отследить зверя.",
  },
  "Выступление": {
    ability: "Харизма",
    description: "Сценическая подача, музыка, речь и впечатление на публику.",
    example: "Отвлечь толпу песней или завоевать внимание зала.",
  },
  "Запугивание": {
    ability: "Харизма",
    description: "Давление, авторитет и умение внушить страх или уважение.",
    example: "Выбить признание из подозреваемого без драки.",
  },
  "История": {
    ability: "Интеллект",
    description: "Знание государств, орденов, войн и важных событий мира.",
    example: "Вспомнить происхождение древнего символа на стене.",
  },
  "Ловкость рук": {
    ability: "Ловкость",
    description: "Тонкая моторика, карманные манипуляции и незаметные действия руками.",
    example: "Спрятать ключ в ладони или незаметно подменить письмо.",
  },
  "Медицина": {
    ability: "Мудрость",
    description: "Базовая диагностика, перевязка и понимание состояния тела.",
    example: "Определить, жив ли раненый персонаж, и стабилизировать его.",
  },
  "Обман": {
    ability: "Харизма",
    description: "Ложь, маскировка мотивации и убедительная подача выдуманной версии.",
    example: "Выдать себя за посланника совета перед стражей.",
  },
  "Обращение с животными": {
    ability: "Мудрость",
    description: "Успокоение, управление и понимание поведения животных.",
    example: "Уговорить ездового зверя не паниковать в бою.",
  },
  "Природа": {
    ability: "Интеллект",
    description: "Знание растений, зверей, стихий и природных циклов.",
    example: "Определить ядовитые грибы или магическую порчу леса.",
  },
  "Проницательность": {
    ability: "Мудрость",
    description: "Чтение эмоций, намерений и скрытых реакций собеседника.",
    example: "Понять, что собеседник что-то утаивает, несмотря на спокойный тон.",
  },
  "Расследование": {
    ability: "Интеллект",
    description: "Анализ улик, логических связей и скрытых закономерностей.",
    example: "Собрать по следам, как именно преступник покинул комнату.",
  },
  "Религия": {
    ability: "Интеллект",
    description: "Знание культов, пантеонов, обрядов и священных символов.",
    example: "Опознать ритуал, который проводят жрецы в руинах.",
  },
  "Скрытность": {
    ability: "Ловкость",
    description: "Незаметное перемещение, укрытие и контроль шума.",
    example: "Подкрасться к часовому или спрятаться за колонной.",
  },
  "Тайная магия": {
    ability: "Интеллект",
    description: "Понимание магических школ, артефактов и заклинательных структур.",
    example: "Определить, что за руну активировал волшебник противника.",
  },
  "Убеждение": {
    ability: "Харизма",
    description: "Спокойное влияние, переговоры и логичное склонение к своей позиции.",
    example: "Убедить совет дать группе ещё один шанс.",
  },
};

const STAT_SKILLS = {
  СИЛ: ["Атлетика"],
  ЛОВ: ["Акробатика", "Ловкость рук", "Скрытность"],
  ВЫН: [],
  ИНТ: ["История", "Природа", "Расследование", "Религия", "Тайная магия"],
  МДР: ["Восприятие", "Выживание", "Медицина", "Обращение с животными", "Проницательность"],
  ХАР: ["Выступление", "Запугивание", "Обман", "Убеждение"],
};

const RULE_ARTICLES = [
  {
    id: "rule-class-fighter",
    category: "Классы",
    title: "Воин",
    content:
      "Воин — универсальный боевой класс, который хорошо показывает базовые механики DnD: действие, бонусное действие, инициатива, класс брони и модификатор характеристики. Он сочетает высокий запас прочности, понятную структуру хода и надёжный урон. На воине легко объяснять, как работает проверка навыка вне боя, спасбросок под давлением эффекта и даже простое заклинание союзника, усиливающее фронтовую линию.",
  },
  {
    id: "rule-race-elf",
    category: "Расы",
    title: "Эльф",
    content:
      "Эльфы традиционно ассоциируются с ловкостью, внимательностью и долгой памятью мира. В кампании эльфийский персонаж часто получает сильную визуальную и культурную идентичность: древние леса, старые клятвы, магические традиции и иной взгляд на время. Это отличный выбор для тех, кто хочет сочетать атмосферу и полезные игровые характеристики.",
  },
  {
    id: "rule-background-soldier",
    category: "Предыстории",
    title: "Солдат",
    content:
      "Предыстория «Солдат» помогает сразу встроить персонажа в структуру мира: прошлую войну, орден, роту, командование или личную клятву. Такой фон особенно хорош, когда нужно показать уже сформированный опыт, дисциплину и конфликт между приказом и личной моралью.",
  },
  {
    id: "rule-equipment-pack",
    category: "Снаряжение",
    title: "Стартовое снаряжение",
    content:
      "Стартовое снаряжение в DnD должно не просто закрывать механику, но и помогать игроку представить образ героя в действии. Правильный комплект отвечает на три вопроса: чем персонаж сражается, как он выживает в пути и какими инструментами решает сцены вне боя. Поэтому в интерфейсе полезно показывать выбор набора не как сухой список, а как реальный сценарий использования.",
  },
  {
    id: "rule-glossary-initiative",
    category: "Глоссарий",
    title: "Инициатива",
    content:
      "Инициатива определяет порядок хода участников в боевой сцене. Обычно персонаж делает бросок d20 и добавляет модификатор Ловкости, после чего система выстраивает очередь действий. Через инициативу игрок быстро понимает, когда он может сделать действие, когда доступно бонусное действие, в какой момент срабатывает спасбросок от эффекта и как класс брони или заклинание союзника помогают пережить раунд.",
  },
  {
    id: "rule-beginner-guide-start",
    category: "Гид для новичка",
    title: "Как начать первую кампанию",
    content:
      "Новичку в DnD полезно мыслить не через весь массив правил сразу, а через несколько простых опор: кто персонаж, чего он хочет, как он действует в сцене и что у него получается при проверке навыка. Первый комфортный старт — это понятный класс, короткая предыстория, одна сильная личная цель и готовность взаимодействовать с группой. Дальше игрок постепенно осваивает модификатор, спасбросок, инициативу, действие, бонусное действие, класс брони и базовое заклинание без перегруза.",
  },
];

const RULE_GLOSSARY = {
  инициатива: {
    label: "Инициатива",
    ruleId: "rule-glossary-initiative",
    hint: "Порядок хода в бою и скорость реакции персонажа.",
  },
  background: {
    label: "Предыстория",
    ruleId: "rule-background-soldier",
    hint: "Прошлая жизнь героя, задающая историю и социальный контекст.",
  },
  снаряжение: {
    label: "Снаряжение",
    ruleId: "rule-equipment-pack",
    hint: "Набор предметов, с которыми персонаж входит в игру.",
  },
  "проверка": {
    label: "Проверка навыка",
    ruleId: "rule-beginner-guide-start",
    hint: "Бросок, который показывает, насколько успешно персонаж решает задачу вне прямого урона.",
  },
  "проверка навыка": {
    label: "Проверка навыка",
    ruleId: "rule-beginner-guide-start",
    hint: "Бросок, который показывает, насколько успешно персонаж решает задачу вне прямого урона.",
  },
  спасбросок: {
    label: "Спасбросок",
    ruleId: "rule-glossary-initiative",
    hint: "Защитный бросок против опасного эффекта, ловушки или магии.",
  },
  "класс брони": {
    label: "Класс брони",
    ruleId: "rule-class-fighter",
    hint: "Порог попадания по персонажу в боевой сцене.",
  },
  модификатор: {
    label: "Модификатор",
    ruleId: "rule-class-fighter",
    hint: "Числовой бонус или штраф от характеристики, влияющий на броски.",
  },
  заклинание: {
    label: "Заклинание",
    ruleId: "rule-class-fighter",
    hint: "Магический эффект, который может атаковать, защищать или менять сцену.",
  },
  действие: {
    label: "Действие",
    ruleId: "rule-glossary-initiative",
    hint: "Основное действие персонажа в свой ход: атака, рывок, помощь и многое другое.",
  },
  "бонусное действие": {
    label: "Бонусное действие",
    ruleId: "rule-glossary-initiative",
    hint: "Дополнительное действие, доступное не всем и не в каждой ситуации.",
  },
  атака: {
    label: "Атака",
    ruleId: "rule-class-fighter",
    hint: "Базовое боевое действие, при котором персонаж пытается нанести урон цели.",
  },
  ход: {
    label: "Ход",
    ruleId: "rule-glossary-initiative",
    hint: "Отрезок времени в раунде, когда персонаж двигается, действует и реагирует на сцену.",
  },
  реакция: {
    label: "Реакция",
    ruleId: "rule-glossary-initiative",
    hint: "Мгновенный ответ на событие вне своего хода, например ответная атака или защитный эффект.",
  },
  статус: {
    label: "Статус",
    ruleId: "rule-glossary-initiative",
    hint: "Состояние персонажа, которое влияет на доступные действия, проверки и боевую эффективность.",
  },
  эффект: {
    label: "Эффект",
    ruleId: "rule-class-fighter",
    hint: "Любое временное или постоянное воздействие: магия, ловушка, аура, бафф или ослабление.",
  },
};

const emptyWizard = () => ({
  name: "",
  className: DND_CLASSES[0].ru,
  classKey: DND_CLASSES[0].name,
  hpMode: "fixed",
  level: 3,
  race: RACES[0].ru,
  gender: "male",
  languagesMode: "random",
  languages: ["Общий", "Эльфийский"],
  alignment: ALIGNMENTS[0].ru,
  abilitiesMode: "quick",
  stats: { ...DND_CLASSES[0].quickStats },
  feat: FEATS[0].name,
  equipmentPack: EQUIPMENT_PACKS[0].name,
  extraEquipment: "",
  backgroundMode: "preset",
  backgroundPreset: BACKGROUND_PRESETS[0],
  backgroundPrompt: "",
  generatedStory: BACKGROUND_PRESETS[0],
});

export default function App() {
  const [role, setRole] = useState("player");
  const [activePage, setActivePage] = useState(defaultPageByRole.player);
  const [searchValue, setSearchValue] = useState("");
  const [characters, setCharacters] = useState(playerCharacters);
  const [selectedCharacterId, setSelectedCharacterId] = useState(playerCharacters[0].id);
  const [selectedCampaignId, setSelectedCampaignId] = useState(campaignsData[0].id);
  const [showWizard, setShowWizard] = useState(false);
  const [wizardStep, setWizardStep] = useState(0);
  const [wizard, setWizard] = useState(emptyWizard);
  const [dashboardBlocks, setDashboardBlocks] = useState({
    pinned: true,
    updates: true,
    recommendations: true,
  });
  const [showDashboardControls, setShowDashboardControls] = useState(false);
  const [noteCampaignFilter, setNoteCampaignFilter] = useState("all");
  const [selectedRuleId, setSelectedRuleId] = useState(RULE_ARTICLES[0].id);
  const [pinnedIds, setPinnedIds] = useState(["camp-1", "note-2", "rule-glossary-initiative", "char-1"]);
  const [createCampaignOpen, setCreateCampaignOpen] = useState(false);
  const [createSessionOpen, setCreateSessionOpen] = useState(false);
  const [sessionMode, setSessionMode] = useState("manual");
  const [sessionFileName, setSessionFileName] = useState("session-archive-08.mp3");
  const [newPlayerNickname, setNewPlayerNickname] = useState("");
  const [campaignDraftPlayers, setCampaignDraftPlayers] = useState(["Элария", "Бром"]);
  const [sessionEventInput, setSessionEventInput] = useState("");
  const [sessionLogsByCampaign, setSessionLogsByCampaign] = useState(() =>
    Object.fromEntries(campaignsData.map((campaign) => [campaign.id, campaign.sessionHistory[0]?.log ?? []])),
  );
  const [collapsedBoards, setCollapsedBoards] = useState({
    locations: false,
    factions: false,
    secrets: false,
  });
  const [analyticsCampaignId, setAnalyticsCampaignId] = useState(campaignsData[0].id);
  const [analyticsSessionId, setAnalyticsSessionId] = useState(campaignsData[0].sessionHistory[0].id);

  const selectedCampaign =
    campaignsData.find((campaign) => campaign.id === selectedCampaignId) ?? campaignsData[0];
  const selectedCharacter =
    characters.find((character) => character.id === selectedCharacterId) ?? characters[0];
  const selectedRule =
    RULE_ARTICLES.find((rule) => rule.id === selectedRuleId) ?? RULE_ARTICLES[0];
  const currentAnalyticsCampaign =
    campaignsData.find((campaign) => campaign.id === analyticsCampaignId) ?? campaignsData[0];
  const currentAnalyticsSession =
    currentAnalyticsCampaign.sessionHistory.find((session) => session.id === analyticsSessionId) ??
    currentAnalyticsCampaign.sessionHistory[0];

  const filteredNotes = useMemo(() => {
    return worldNotes.filter((note) => {
      const matchesCampaign = noteCampaignFilter === "all" || note.campaignId === noteCampaignFilter;
      const matchesSearch = !searchValue.trim()
        ? true
        : `${note.title} ${note.text} ${note.category} ${note.campaignName}`
            .toLowerCase()
            .includes(searchValue.toLowerCase());
      return matchesCampaign && matchesSearch;
    });
  }, [noteCampaignFilter, searchValue]);

  const filteredRules = useMemo(() => {
    return RULE_ARTICLES.filter((rule) => {
      if (!searchValue.trim()) {
        return true;
      }
      return `${rule.category} ${rule.title} ${rule.content}`
        .toLowerCase()
        .includes(searchValue.toLowerCase());
    });
  }, [searchValue]);

  const groupedRules = useMemo(() => {
    return filteredRules.reduce((accumulator, rule) => {
      accumulator[rule.category] = accumulator[rule.category] ?? [];
      accumulator[rule.category].push(rule);
      return accumulator;
    }, {});
  }, [filteredRules]);

  const pinnedItems = useMemo(() => {
    const allItems = [
      ...campaignsData.map((campaign) => ({
        id: campaign.id,
        label: campaign.name,
        meta: campaign.nextSessionTitle,
        type: "campaign",
      })),
      ...worldNotes.map((note) => ({
        id: note.id,
        label: note.title,
        meta: note.campaignName,
        type: "note",
      })),
      ...RULE_ARTICLES.map((rule) => ({
        id: rule.id,
        label: rule.title,
        meta: rule.category,
        type: "rule",
      })),
      ...characters.map((character) => ({
        id: character.id,
        label: character.name,
        meta: character.className,
        type: "character",
      })),
    ];
    return allItems.filter((item) => pinnedIds.includes(item.id));
  }, [characters, pinnedIds]);

  const currentClass = DND_CLASSES.find((item) => item.name === wizard.classKey) ?? DND_CLASSES[0];

  const handleRoleSwitch = (nextRole) => {
    setRole(nextRole);
    setActivePage(defaultPageByRole[nextRole]);
  };

  const openCampaignDetail = (campaignId) => {
    setSelectedCampaignId(campaignId);
    setActivePage("campaign-detail");
  };

  const togglePin = (id) => {
    setPinnedIds((current) =>
      current.includes(id) ? current.filter((value) => value !== id) : [id, ...current],
    );
  };

  const openWizard = () => {
    setWizard(emptyWizard());
    setWizardStep(0);
    setShowWizard(true);
  };

  const closeWizard = () => {
    setShowWizard(false);
    setWizardStep(0);
  };

  const updateWizard = (patch) => setWizard((current) => ({ ...current, ...patch }));

  const updateWizardStats = (stats) =>
    setWizard((current) => ({
      ...current,
      stats: {
        ...current.stats,
        ...stats,
      },
    }));

  const applyQuickStats = (classKey) => {
    const classInfo = DND_CLASSES.find((item) => item.name === classKey) ?? DND_CLASSES[0];
    setWizard((current) => ({
      ...current,
      classKey,
      className: classInfo.ru,
      stats: { ...classInfo.quickStats },
    }));
  };

  const applyRandomStats = () => {
    const values = ["СИЛ", "ЛОВ", "ВЫН", "ИНТ", "МДР", "ХАР"].reduce((accumulator, stat) => {
      accumulator[stat] = 8 + Math.floor(Math.random() * 11);
      return accumulator;
    }, {});
    updateWizardStats(values);
  };

  const applyManualDistribution = () => {
    updateWizardStats({ СИЛ: 15, ЛОВ: 14, ВЫН: 13, ИНТ: 12, МДР: 10, ХАР: 8 });
  };

  const randomizeLanguages = () => {
    const shuffled = [...LANGUAGES].sort(() => Math.random() - 0.5).slice(0, 3);
    updateWizard({ languages: shuffled });
  };

  const toggleLanguage = (language) => {
    setWizard((current) => ({
      ...current,
      languages: current.languages.includes(language)
        ? current.languages.filter((item) => item !== language)
        : [...current.languages, language],
    }));
  };

  const generateAiStory = () => {
    const promptBase = wizard.backgroundPrompt.trim();
    const template = AI_STORIES[Math.floor(Math.random() * AI_STORIES.length)];
    updateWizard({
      generatedStory: promptBase ? `${promptBase} ${template}` : template,
    });
  };

  const finishWizard = () => {
    const hitPoints =
      wizard.hpMode === "fixed"
        ? currentClass.hitDie + calculateModifier(wizard.stats.ВЫН) + (wizard.level - 1) * currentClass.fixedHp
        : rollHitPoints(currentClass.hitDie, wizard.level, calculateModifier(wizard.stats.ВЫН));
    const character = {
      id: `char-${Date.now()}`,
      campaignId: selectedCampaign.id,
      campaignName: selectedCampaign.name,
      name: wizard.name || `${wizard.race} ${wizard.className}`,
      className: wizard.className,
      race: wizard.race,
      level: wizard.level,
      hp: hitPoints,
      armor: 10 + Math.max(calculateModifier(wizard.stats.ЛОВ), 1) + 3,
      initiative: formatModifier(calculateModifier(wizard.stats.ЛОВ)),
      background: wizard.generatedStory || wizard.backgroundPreset,
      gender: wizard.gender,
      languages: wizard.languages,
      alignment: wizard.alignment,
      feat: wizard.feat,
      inventory: [
        ...((EQUIPMENT_PACKS.find((item) => item.name === wizard.equipmentPack)?.items) ?? []),
        ...(wizard.extraEquipment ? [wizard.extraEquipment] : []),
      ],
      stats: { ...wizard.stats },
      skills: buildFullSkills(wizard.stats),
    };
    setCharacters((current) => [character, ...current]);
    setSelectedCharacterId(character.id);
    setActivePage("characters");
    closeWizard();
  };

  const handleCharacterFieldChange = (field, value) => {
    setCharacters((current) =>
      current.map((character) =>
        character.id === selectedCharacterId ? { ...character, [field]: value } : character,
      ),
    );
  };

  const handleCharacterStatChange = (stat, value) => {
    const nextValue = Number(value);
    setCharacters((current) =>
      current.map((character) =>
        character.id === selectedCharacterId
          ? {
              ...character,
              stats: { ...character.stats, [stat]: nextValue },
              initiative:
                stat === "ЛОВ" ? formatModifier(calculateModifier(nextValue)) : character.initiative,
              skills: buildFullSkills(
                stat === "ЛОВ"
                  ? { ...character.stats, [stat]: nextValue }
                  : { ...character.stats, [stat]: nextValue },
              ),
            }
          : character,
      ),
    );
  };

  const addCampaignDraftPlayer = () => {
    if (!newPlayerNickname.trim()) {
      return;
    }
    setCampaignDraftPlayers((current) => [...current, newPlayerNickname.trim()]);
    setNewPlayerNickname("");
  };

  const addSessionEvent = () => {
    if (!sessionEventInput.trim()) {
      return;
    }
    setSessionLogsByCampaign((current) => ({
      ...current,
      [selectedCampaign.id]: [sessionEventInput, ...(current[selectedCampaign.id] ?? [])],
    }));
    setSessionEventInput("");
  };

  const playerContent = () => {
    if (activePage === "campaign-detail") {
      return (
        <CampaignDetailPage
          role="player"
          campaign={selectedCampaign}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
          onSelectRule={setSelectedRuleId}
          onOpenRules={() => setActivePage("rules")}
          onOpenCreateSession={() => {}}
        />
      );
    }

    if (activePage === "campaigns") {
      return (
        <CampaignCatalog
        eyebrow="Игрок / Кампании"
          title="Активные кампании"
          description="Открывайте кампанию, чтобы быстро восстановить события, заметки и контекст последних игровых сцен."
          campaigns={campaignsData}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
          onOpenCampaign={openCampaignDetail}
        />
      );
    }

    if (activePage === "characters") {
      return (
        <CharactersPage
          characters={characters}
          selectedCharacter={selectedCharacter}
          onSelectCharacter={setSelectedCharacterId}
          onOpenWizard={openWizard}
          onCharacterFieldChange={handleCharacterFieldChange}
          onCharacterStatChange={handleCharacterStatChange}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
        />
      );
    }

    if (activePage === "notes") {
      return (
        <NotesWorldPage
          notes={filteredNotes}
          campaigns={campaignsData}
          currentFilter={noteCampaignFilter}
          onChangeFilter={setNoteCampaignFilter}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
        />
      );
    }

    if (activePage === "rules") {
      return (
        <RulesPage
          groupedRules={groupedRules}
          selectedRule={selectedRule}
          onSelectRule={setSelectedRuleId}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
        />
      );
    }

    return (
      <PlayerDashboard
        campaigns={campaignsData}
        selectedCampaign={selectedCampaign}
        characters={characters}
        pinnedItems={pinnedItems}
        dashboardBlocks={dashboardBlocks}
        onToggleDashboardBlock={(key) =>
          setDashboardBlocks((current) => ({ ...current, [key]: !current[key] }))
        }
        showDashboardControls={showDashboardControls}
        onToggleControls={() => setShowDashboardControls((current) => !current)}
        onOpenCampaign={openCampaignDetail}
        onTogglePin={togglePin}
      />
    );
  };

  const dmContent = () => {
    if (activePage === "campaign-detail") {
      return (
        <CampaignDetailPage
          role="dm"
          campaign={selectedCampaign}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
          onSelectRule={setSelectedRuleId}
          onOpenRules={() => setActivePage("analytics")}
          collapsedBoards={collapsedBoards}
          onToggleBoard={(key) =>
            setCollapsedBoards((current) => ({ ...current, [key]: !current[key] }))
          }
          onOpenCreateSession={() => setCreateSessionOpen(true)}
        />
      );
    }

    if (activePage === "campaigns") {
      return (
        <DMCampaignsPage
          campaigns={campaignsData}
          pinnedIds={pinnedIds}
          onTogglePin={togglePin}
          onOpenCampaign={openCampaignDetail}
          onOpenCreateCampaign={() => setCreateCampaignOpen(true)}
        />
      );
    }

    if (activePage === "session") {
      return (
        <WorldBuildingPage
          campaign={selectedCampaign}
          collapsedBoards={collapsedBoards}
          onToggleBoard={(key) =>
            setCollapsedBoards((current) => ({ ...current, [key]: !current[key] }))
          }
        />
      );
    }

    if (activePage === "analytics") {
      return (
        <AnalyticsPage
          analytics={analyticsData}
          campaigns={campaignsData}
          selectedCampaignId={analyticsCampaignId}
          selectedSessionId={analyticsSessionId}
          onSelectCampaign={(campaignId) => {
            setAnalyticsCampaignId(campaignId);
            const campaign = campaignsData.find((item) => item.id === campaignId) ?? campaignsData[0];
            setAnalyticsSessionId(campaign.sessionHistory[0].id);
          }}
          onSelectSession={setAnalyticsSessionId}
          currentCampaign={currentAnalyticsCampaign}
          currentSession={currentAnalyticsSession}
        />
      );
    }

    if (activePage === "notes") {
      return <DMNotesPage notes={dmNotes} campaigns={campaignsData} />;
    }

    return <DMDashboard campaigns={campaignsData} pinnedItems={pinnedItems} onOpenCampaign={openCampaignDetail} />;
  };

  return (
    <Layout
      role={role}
      activePage={activePage}
      onPageChange={setActivePage}
      searchValue={searchValue}
      onSearchChange={setSearchValue}
      onRoleSwitch={handleRoleSwitch}
      user={userProfile}
      notifications={notifications}
    >
      <div className="animate-fade-slide">{role === "player" ? playerContent() : dmContent()}</div>
      {showWizard ? (
        <CharacterWizardModal
          wizard={wizard}
          wizardStep={wizardStep}
          onClose={closeWizard}
          onBack={() => setWizardStep((current) => Math.max(current - 1, 0))}
          onNext={() => setWizardStep((current) => Math.min(current + 1, 7))}
          onUpdate={updateWizard}
          onUpdateStats={updateWizardStats}
          onApplyQuickStats={applyQuickStats}
          onApplyRandomStats={applyRandomStats}
          onApplyManualDistribution={applyManualDistribution}
          onRandomizeLanguages={randomizeLanguages}
          onToggleLanguage={toggleLanguage}
          onGenerateAiStory={generateAiStory}
          onFinish={finishWizard}
          currentClass={currentClass}
        />
      ) : null}
      {createCampaignOpen ? (
        <ModalShell title="Создать кампанию" onClose={() => setCreateCampaignOpen(false)}>
          <div className="grid gap-4">
            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">Название кампании</span>
              <input
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                defaultValue="Новая кампания"
              />
            </label>
            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">Краткое описание</span>
              <textarea
                rows="4"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                defaultValue="Точка входа для новой сюжетной арки, игроков и структуры мира."
              />
            </label>
            <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Игроки кампании</p>
                <Tag tone="warm">Игроки</Tag>
              </div>
              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <input
                  value={newPlayerNickname}
                  onChange={(event) => setNewPlayerNickname(event.target.value)}
                  placeholder="Добавить игрока по нику"
                  className="flex-1 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none"
                />
                <button
                  onClick={addCampaignDraftPlayer}
                  className="inline-flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-5 py-3 text-sm font-medium text-white"
                >
                  <UserPlus className="h-4 w-4" />
                  Добавить
                </button>
              </div>
              <div className="mt-4 flex flex-wrap gap-2">
                {campaignDraftPlayers.map((player) => (
                  <Tag key={player} tone="green">
                    {player}
                  </Tag>
                ))}
              </div>
              <p className="mt-4 text-sm text-stone-400">На стороне игрока появится уведомление: «Вас добавили в кампанию».</p>
            </div>
          </div>
        </ModalShell>
      ) : null}
      {createSessionOpen ? (
        <ModalShell title="Создать сессию" onClose={() => setCreateSessionOpen(false)}>
          <div className="space-y-5">
            <div className="flex gap-2">
              <button
                onClick={() => setSessionMode("manual")}
                className={`rounded-2xl px-4 py-2 text-sm ${
                  sessionMode === "manual"
                    ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                    : "border border-white/10 bg-white/5 text-stone-300"
                }`}
              >
                Вручную
              </button>
              <button
                onClick={() => setSessionMode("audio")}
                className={`rounded-2xl px-4 py-2 text-sm ${
                  sessionMode === "audio"
                    ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                    : "border border-white/10 bg-white/5 text-stone-300"
                }`}
              >
                Загрузка аудио
              </button>
            </div>
            {sessionMode === "manual" ? (
              <div className="grid gap-4">
                <input
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                  defaultValue="Сессия 9: Пламя под архивом"
                />
                <textarea
                  rows="4"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                  defaultValue="Ключевые заметки: вход в архив, конфликт с Иарой, скрытый ход в нижние залы."
                />
                <textarea
                  rows="4"
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                  defaultValue="События: вход группы, дипломатическая сцена, бой в библиотеке."
                />
              </div>
            ) : (
              <div className="grid gap-4">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200">
                  <Upload className="h-4 w-4" />
                  Загрузить аудио
                </button>
                <input
                  value={sessionFileName}
                  onChange={(event) => setSessionFileName(event.target.value)}
                  className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
                />
                <div className="grid gap-4 lg:grid-cols-2">
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Сгенерированный таймлайн</p>
                    <div className="mt-3 space-y-2 text-sm text-stone-300">
                      {selectedCampaign.audioInsights.generatedTimeline.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Ключевые события</p>
                    <div className="mt-3 space-y-2 text-sm text-stone-300">
                      {selectedCampaign.audioInsights.keyEvents.map((item) => (
                        <p key={item}>{item}</p>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </ModalShell>
      ) : null}
    </Layout>
  );
}

function PlayerDashboard({
  campaigns,
  selectedCampaign,
  characters,
  pinnedItems,
  dashboardBlocks,
  onToggleDashboardBlock,
  showDashboardControls,
  onToggleControls,
  onOpenCampaign,
  onTogglePin,
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Игрок / Главная"
        title="Центр приключений"
        description="Отслеживайте активные кампании, последние изменения в мире и всё, что важно перед следующей игровой сессией."
        action={
          <div className="relative">
            <button
              onClick={onToggleControls}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 transition hover:bg-white/10"
            >
              <Filter className="h-4 w-4" />
              Настроить блоки
            </button>
            {showDashboardControls ? (
              <div className="absolute right-0 top-[calc(100%+12px)] z-20 w-72 rounded-[24px] border border-white/10 bg-[#120d0f]/95 p-4 shadow-2xl backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Видимость блоков</p>
                <div className="mt-4 space-y-3">
                  {[
                    { key: "pinned", label: "Закреплённое" },
                    { key: "updates", label: "Последние обновления" },
                    { key: "recommendations", label: "Рекомендации" },
                  ].map((item) => (
                    <button
                      key={item.key}
                      onClick={() => onToggleDashboardBlock(item.key)}
                      className="flex w-full items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200"
                    >
                      {item.label}
                      <span className={dashboardBlocks[item.key] ? "text-emerald-300" : "text-stone-500"}>
                        {dashboardBlocks[item.key] ? "Вкл" : "Выкл"}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <GlassCard className="overflow-hidden">
            <div className="flex flex-col gap-6 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Следующая сессия</p>
                <h4 className="mt-2 break-words font-display text-4xl text-parchment">{selectedCampaign.nextSessionTitle}</h4>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-300">{selectedCampaign.summary}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatPill label="Дата" value={selectedCampaign.nextSessionDate} tone="warm" />
                <StatPill label="Кампания" value={selectedCampaign.name} tone="blue" />
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-5 md:grid-cols-2">
            {campaigns.map((campaign) => (
              <button key={campaign.id} onClick={() => onOpenCampaign(campaign.id)} className="text-left">
                <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <Tag tone="warm">{campaign.status}</Tag>
                      <h4 className="mt-4 break-words font-display text-3xl text-parchment">{campaign.name}</h4>
                      <p className="mt-2 text-sm text-stone-400">{campaign.theme}</p>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onTogglePin(campaign.id);
                      }}
                      className="rounded-2xl border border-white/10 bg-white/5 p-2 text-stone-300"
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-6 rounded-[22px] border border-white/10 bg-black/20 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Следующая цель</p>
                    <p className="mt-2 text-sm text-stone-200">{campaign.nextGoal}</p>
                  </div>
                  <div className="mt-4 flex items-center justify-between text-sm text-stone-400">
                    <span>{campaign.nextSessionDate}</span>
                    <span className="inline-flex items-center gap-2 text-amber-100">
                      Открыть <ChevronRight className="h-4 w-4" />
                    </span>
                  </div>
                </GlassCard>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {dashboardBlocks.pinned ? (
            <GlassCard>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Закреплённое</p>
                <Pin className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-5 space-y-3">
                {pinnedItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                    <div className="min-w-0">
                      <p className="truncate text-sm text-stone-100">{item.label}</p>
                      <p className="truncate text-xs text-stone-500">
                        {item.type} • {item.meta}
                      </p>
                    </div>
                    <Tag tone="green">Закреплено</Tag>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          {dashboardBlocks.updates ? (
            <GlassCard>
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Последние обновления</p>
                <BellPlus className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-5 space-y-3">
                {selectedCampaign.updates.map((update) => (
                  <div key={update.id} className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-stone-100">{update.title}</p>
                      <span className="text-xs text-stone-500">{update.time}</span>
                    </div>
                    <p className="mt-2 text-xs text-stone-500">{update.author}</p>
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          {dashboardBlocks.recommendations ? (
            <GlassCard className="bg-[linear-gradient(180deg,rgba(185,138,74,0.14),rgba(255,255,255,0.03))]">
              <div className="flex items-center justify-between">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Рекомендации</p>
                <BookMarked className="h-4 w-4 text-amber-300" />
              </div>
              <div className="mt-5 space-y-3 text-sm leading-7 text-stone-300">
                {selectedCampaign.recommendations.map((recommendation) => (
                  <div key={recommendation} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                    {recommendation}
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Активность группы</p>
            <div className="mt-5 space-y-3">
              {characters.map((character) => (
                <div key={character.id} className="flex items-center justify-between rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                  <div className="min-w-0">
                    <p className="truncate text-sm text-stone-100">{character.name}</p>
                    <p className="truncate text-xs text-stone-500">
                      {character.className} • {character.campaignName}
                    </p>
                  </div>
                  <ChevronRight className="h-4 w-4 text-stone-500" />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function CampaignCatalog({ eyebrow, title, description, campaigns, pinnedIds, onTogglePin, onOpenCampaign }) {
  return (
    <section>
      <SectionTitle eyebrow={eyebrow} title={title} description={description} />
      <div className="grid gap-6 xl:grid-cols-2">
        {campaigns.map((campaign) => (
          <button key={campaign.id} onClick={() => onOpenCampaign(campaign.id)} className="text-left">
            <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0">
                  <Tag tone="warm">{campaign.status}</Tag>
                  <h4 className="mt-4 break-words font-display text-3xl text-parchment">{campaign.name}</h4>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{campaign.summary}</p>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onTogglePin(campaign.id);
                  }}
                  className={`rounded-2xl border p-2 ${
                    pinnedIds.includes(campaign.id)
                      ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                      : "border-white/10 bg-white/5 text-stone-300"
                  }`}
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <StatPill label="Следующая сессия" value={campaign.nextSessionDate} tone="warm" />
                <StatPill label="Игроки" value={campaign.players.length} tone="blue" />
              </div>
              <div className={`mt-6 rounded-[24px] border border-white/10 bg-gradient-to-br ${campaign.mapTint} p-4`}>
                <p className="text-xs uppercase tracking-[0.24em] text-parchment/70">Карта</p>
                <p className="mt-2 break-words font-display text-2xl text-parchment">{campaign.mapLabel}</p>
              </div>
            </GlassCard>
          </button>
        ))}
      </div>
    </section>
  );
}

function CharactersPage({
  characters,
  selectedCharacter,
  onSelectCharacter,
  onOpenWizard,
  onCharacterFieldChange,
  onCharacterStatChange,
  pinnedIds,
  onTogglePin,
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Игрок / Персонажи"
        title="Персонажи"
        description="Полный лист персонажа доступен прямо в платформе: характеристики, навыки, происхождение, языки и снаряжение собраны в одной рабочей области."
        action={
          <button
            onClick={onOpenWizard}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white shadow-lg shadow-red-950/30 transition hover:scale-[1.01]"
          >
            <Plus className="h-4 w-4" />
            Создать персонажа
          </button>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Список героев</p>
          <div className="mt-5 space-y-3">
            {characters.map((character) => {
              const isActive = character.id === selectedCharacter?.id;
              return (
                <button
                  key={character.id}
                  onClick={() => onSelectCharacter(character.id)}
                  className={`w-full rounded-[24px] border p-4 text-left transition ${
                    isActive ? "border-amber-400/25 bg-amber-500/10" : "border-white/10 bg-white/5 hover:bg-white/10"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <h4 className="truncate font-display text-2xl text-parchment">{character.name}</h4>
                      <p className="mt-1 text-sm text-stone-400">
                        {character.race} • {character.className}
                      </p>
                    </div>
                    <button
                      onClick={(event) => {
                        event.stopPropagation();
                        onTogglePin(character.id);
                      }}
                      className={`rounded-2xl border p-2 ${
                        pinnedIds.includes(character.id)
                          ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                          : "border-white/10 bg-white/5 text-stone-300"
                      }`}
                    >
                      <Pin className="h-4 w-4" />
                    </button>
                  </div>
                  <div className="mt-4 grid grid-cols-3 gap-3">
                    <StatPill label="Ур." value={character.level} tone="warm" />
                    <StatPill label="HP" value={character.hp} tone="red" />
                    <StatPill label="ЛОВ" value={character.stats.ЛОВ} tone="green" />
                  </div>
                </button>
              );
            })}
          </div>
        </GlassCard>

        <CharacterSheet
          character={selectedCharacter}
          onFieldChange={onCharacterFieldChange}
          onStatChange={onCharacterStatChange}
        />
      </div>
    </section>
  );
}

function CharacterSheet({ character, onFieldChange, onStatChange }) {
  if (!character) return null;

  return (
    <GlassCard className="overflow-hidden">
      <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
        <div className="min-w-0">
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Лист персонажа</p>
          <input
            value={character.name}
            onChange={(event) => onFieldChange("name", event.target.value)}
            className="mt-2 w-full bg-transparent font-display text-4xl text-parchment outline-none"
          />
          <p className="mt-2 text-sm text-stone-400">
            {character.race} • {character.className} • Кампания: {character.campaignName}
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <StatPill label="Ур." value={character.level} tone="warm" />
          <StatPill label="HP" value={character.hp} tone="red" />
          <StatPill label="Класс брони" value={character.armor} tone="blue" />
          <button className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200">
            Выгрузить лист персонажа
          </button>
        </div>
      </div>

      <div className="mt-8 grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Характеристики</p>
          <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.entries(character.stats).map(([stat, value]) => (
              <StatWithTooltip
                key={stat}
                stat={stat}
                value={value}
                onChange={(nextValue) => onStatChange(stat, nextValue)}
              />
            ))}
          </div>
        </div>

        <div className="grid gap-6">
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Предыстория</p>
            <textarea
              rows="6"
              value={character.background}
              onChange={(event) => onFieldChange("background", event.target.value)}
              className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm leading-7 text-stone-300 outline-none"
            />
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Навыки</p>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {Object.entries(character.skills ?? buildFullSkills(character.stats)).map(([name, value]) => (
                <SkillTooltipCard key={name} name={name} value={value} />
              ))}
            </div>
          </div>
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-5">
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Снаряжение</p>
            <div className="mt-4 flex flex-wrap gap-3">
              {character.inventory.map((item) => (
                <span key={item} className="rounded-full border border-amber-400/20 bg-amber-500/10 px-4 py-2 text-sm text-amber-100">
                  {item}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

function StatWithTooltip({ stat, value, onChange }) {
  const skills = STAT_SKILLS[stat] ?? [];
  return (
    <div className="group relative rounded-[22px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{stat}</p>
      <input
        type="number"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-3 w-full bg-transparent text-2xl text-stone-100 outline-none"
      />
      <p className="text-xs text-stone-500">Мод.: {formatModifier(calculateModifier(value))}</p>
      {skills.length > 0 ? (
        <>
          <p className="mt-3 text-xs text-amber-100 underline decoration-dotted underline-offset-4">Связанные навыки</p>
          <div className="pointer-events-none absolute left-0 top-full z-20 hidden w-80 rounded-2xl border border-white/10 bg-[#120d0f] p-4 text-left shadow-2xl group-hover:block">
            <p className="text-sm text-parchment">{stat} — связанные навыки</p>
            <div className="mt-3 space-y-3">
              {skills.map((skill) => (
                <div key={skill}>
                  <p className="text-sm text-stone-100">
                    {skill} ({SKILL_INFO[skill].ability})
                  </p>
                  <p className="mt-1 text-xs leading-6 text-stone-400">{SKILL_INFO[skill].description}</p>
                  <p className="text-xs leading-6 text-amber-100">Пример: {SKILL_INFO[skill].example}</p>
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
}

function SkillTooltipCard({ name, value }) {
  const info = SKILL_INFO[name];
  return (
    <div className="group relative rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
      <p className="text-sm text-stone-100">{name}</p>
      <p className="mt-1 text-lg text-amber-100">{formatModifier(value)}</p>
      <div className="pointer-events-none absolute left-0 top-full z-20 hidden w-72 rounded-2xl border border-white/10 bg-[#120d0f] p-4 text-left shadow-2xl group-hover:block">
        <p className="text-sm text-parchment">
          {name} ({info.ability})
        </p>
        <p className="mt-2 text-xs leading-6 text-stone-300">{info.description}</p>
        <p className="mt-1 text-xs leading-6 text-amber-100">Пример: {info.example}</p>
      </div>
    </div>
  );
}

function NotesWorldPage({ notes, campaigns, currentFilter, onChangeFilter, pinnedIds, onTogglePin }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Игрок / Заметки"
        title="Заметки и мир"
        description="Структурированные заметки по неигровым персонажам, квестам и сценам. Фильтруйте их по кампаниям и отслеживайте связанные записи как в личной базе знаний."
      />
      <div className="mb-6 flex flex-wrap gap-2">
        <button
          onClick={() => onChangeFilter("all")}
          className={`rounded-2xl border px-4 py-2 text-sm ${
            currentFilter === "all"
              ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
              : "border-white/10 bg-white/5 text-stone-300"
          }`}
        >
          Все кампании
        </button>
        {campaigns.map((campaign) => (
          <button
            key={campaign.id}
            onClick={() => onChangeFilter(campaign.id)}
            className={`rounded-2xl border px-4 py-2 text-sm ${
              currentFilter === campaign.id
                ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
                : "border-white/10 bg-white/5 text-stone-300"
            }`}
          >
            {campaign.name}
          </button>
        ))}
      </div>
      <div className="grid gap-5 lg:grid-cols-3">
        {notes.map((note) => (
          <GlassCard key={note.id} className="transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap gap-2">
                <Tag tone="warm">{note.category}</Tag>
                <Tag>{note.campaignName}</Tag>
              </div>
              <button
                onClick={() => onTogglePin(note.id)}
                className={`rounded-2xl border p-2 ${
                  pinnedIds.includes(note.id)
                    ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                    : "border-white/10 bg-white/5 text-stone-300"
                }`}
              >
                <Pin className="h-4 w-4" />
              </button>
            </div>
            <h4 className="mt-5 font-display text-2xl text-parchment">{note.title}</h4>
            <p className="mt-3 text-sm leading-7 text-stone-300">{note.text}</p>
            <div className="mt-5 flex items-center justify-between text-xs text-stone-500">
              <span>{note.updatedAt}</span>
              <span>{note.visibility}</span>
            </div>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-black/20 p-4">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-500">
                <Link2 className="h-3.5 w-3.5" />
                Связанные заметки
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {note.links.length > 0 ? (
                  note.links.map((link) => (
                    <span key={link} className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-3 py-1 text-xs text-emerald-100">
                      {link}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-stone-500">Нет связей</span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </section>
  );
}

function RulesPage({ groupedRules, selectedRule, onSelectRule, pinnedIds, onTogglePin }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Игрок / Правила"
        title="Справочник правил"
        description="База знаний организована по категориям. Любая статья открывается как полноценная страница правила, а сложные термины можно быстро расшифровать через всплывающую подсказку."
      />
      <div className="grid gap-6 xl:grid-cols-[0.85fr_1.15fr]">
        <GlassCard>
          <div className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-400">
            <Search className="h-4 w-4" />
            <span className="text-sm">Поиск использует верхнюю строку интерфейса</span>
          </div>
          <div className="mt-5 space-y-5">
            {Object.entries(groupedRules).map(([category, rules]) => (
              <div key={category}>
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{category}</p>
                <div className="mt-3 space-y-3">
                  {rules.map((rule) => (
                    <button
                      key={rule.id}
                      onClick={() => onSelectRule(rule.id)}
                      className={`w-full rounded-[24px] border p-4 text-left ${
                        selectedRule.id === rule.id
                          ? "border-amber-400/20 bg-amber-500/10"
                          : "border-white/10 bg-white/5"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <h4 className="break-words font-display text-2xl text-parchment">{rule.title}</h4>
                          <p className="mt-2 text-xs text-stone-500">{rule.category}</p>
                        </div>
                        <button
                          onClick={(event) => {
                            event.stopPropagation();
                            onTogglePin(rule.id);
                          }}
                          className={`rounded-2xl border p-2 ${
                            pinnedIds.includes(rule.id)
                              ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                              : "border-white/10 bg-white/5 text-stone-300"
                          }`}
                        >
                          <Pin className="h-4 w-4" />
                        </button>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Статья правила</p>
          <h4 className="mt-2 font-display text-4xl text-parchment">{selectedRule.title}</h4>
          <p className="mt-2 text-xs uppercase tracking-[0.24em] text-stone-500">{selectedRule.category}</p>
          <div className="mt-5 text-sm leading-8 text-stone-300">{renderRuleContent(selectedRule.content, onSelectRule)}</div>
        </GlassCard>
      </div>
    </section>
  );
}

function CampaignDetailPage({
  role,
  campaign,
  pinnedIds,
  onTogglePin,
  onSelectRule,
  onOpenRules,
  collapsedBoards = {},
  onToggleBoard = () => {},
  onOpenCreateSession,
}) {
  return (
    <section>
      <SectionTitle
        eyebrow={`${role === "player" ? "Игрок" : "Мастер"} / Кампания`}
        title={campaign.name}
        description={campaign.summary}
        action={
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => onTogglePin(campaign.id)}
              className={`inline-flex items-center gap-2 rounded-2xl border px-4 py-3 text-sm ${
                pinnedIds.includes(campaign.id)
                  ? "border-amber-400/20 bg-amber-500/10 text-amber-100"
                  : "border-white/10 bg-white/5 text-stone-200"
              }`}
            >
              <Pin className="h-4 w-4" />
              Закрепить
            </button>
            {role === "dm" ? (
              <button
                onClick={onOpenCreateSession}
                className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white"
              >
                <Plus className="h-4 w-4" />
                Создать сессию
              </button>
            ) : null}
            <button
              onClick={onOpenRules}
              className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200"
            >
              <BookOpenCheck className="h-4 w-4" />
              {role === "player" ? "К правилам" : "К аналитике"}
            </button>
          </div>
        }
      />

      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <GlassCard>
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <Tag tone="warm">{campaign.status}</Tag>
                <h4 className="mt-4 break-words font-display text-4xl text-parchment">{campaign.nextSessionTitle}</h4>
                <p className="mt-4 text-sm leading-7 text-stone-300">{campaign.nextGoal}</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <StatPill label="Следующая сессия" value={campaign.nextSessionDate} tone="warm" />
                <StatPill label="Игроки" value={campaign.players.length} tone="blue" />
              </div>
            </div>
          </GlassCard>

          <GlassCard>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Таймлайн</p>
              <Tag tone="green">По хронологии</Tag>
            </div>
            <div className="mt-8 space-y-6">
              {campaign.timeline.map((event, index) => (
                <div key={event.id} className="relative pl-10">
                  <div className="absolute left-3 top-1 h-full w-px bg-gradient-to-b from-amber-400/60 to-transparent" />
                  <div className="absolute left-0 top-1 flex h-6 w-6 items-center justify-center rounded-full border border-amber-400/30 bg-amber-500/10 text-xs text-amber-100">
                    {index + 1}
                  </div>
                  <div className="rounded-[22px] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm text-amber-100">{event.date}</p>
                      <span className="text-xs text-stone-500">{event.linkedTo}</span>
                    </div>
                    <h5 className="mt-2 text-lg text-stone-100">{event.title}</h5>
                    <p className="mt-2 text-sm leading-7 text-stone-300">{event.text}</p>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">История сессий</p>
            <div className="mt-5 space-y-4">
              {campaign.sessionHistory.map((session) => (
                <div key={session.id} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm text-stone-300">{session.date}</p>
                      <h4 className="break-words font-display text-2xl text-parchment">{session.title}</h4>
                    </div>
                    <Tag tone={session.status === "active" ? "warm" : "default"}>
                      {session.status === "active" ? "Активна" : "Завершена"}
                    </Tag>
                  </div>
                  <p className="mt-3 text-sm text-stone-300">{session.summary}</p>
                  <div className="mt-4 grid gap-3 lg:grid-cols-2">
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Журнал сессии</p>
                      <div className="mt-3 space-y-2 text-sm text-stone-300">
                        {session.log.map((item) => (
                          <p key={item}>{item}</p>
                        ))}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Обновления</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {[...session.actions, ...session.updates].map((item) => (
                          <Tag key={item}>{item}</Tag>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Игроки</p>
              <AvatarStack people={campaign.players} />
            </div>
            <div className="mt-5 space-y-3">
              {campaign.players.map((player) => (
                <div key={player.id} className="flex items-center justify-between rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-500 to-red-800 font-semibold text-white">
                      {player.avatar}
                    </div>
                    <div>
                      <p className="text-sm text-stone-100">{player.name}</p>
                      <p className="text-xs text-stone-500">{player.className}</p>
                    </div>
                  </div>
                  <Tag tone={player.status === "Онлайн" ? "green" : "default"}>{player.status}</Tag>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Ключевые сюжетные моменты</p>
            <div className="mt-5 space-y-3">
              {campaign.storyMoments.map((moment) => (
                <div key={moment} className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-stone-300">
                  {moment}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Заметки кампании</p>
            <div className="mt-5 space-y-3">
              {campaign.campaignNotes.map((note) => (
                <div key={note} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm text-stone-300">
                  {renderRuleContent(note, onSelectRule)}
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className={`bg-gradient-to-br ${campaign.mapTint}`}>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-parchment/70">Карта</p>
              <MapPinned className="h-4 w-4 text-parchment/80" />
            </div>
            <h4 className="mt-3 break-words font-display text-3xl text-parchment">{campaign.mapLabel}</h4>
            <p className="mt-3 max-w-xl text-sm leading-7 text-parchment/80">
              Карта прикреплена к кампании и используется как опорная точка для сессий, лора и связей между сценами.
            </p>
          </GlassCard>

          {role === "dm" ? (
            <GlassCard>
              <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Доска связей</p>
                <Tag tone="green">Чистые кластеры</Tag>
              </div>
              <div className="mt-5 space-y-4">
                {Object.entries(campaign.relationships).map(([key, items]) => (
                  <div key={key} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                    <button onClick={() => onToggleBoard(key)} className="flex w-full items-center justify-between text-left">
                      <p className="text-sm text-stone-100">{relationshipTitle(key)}</p>
                      <span className="text-xs text-stone-500">{collapsedBoards[key] ? "Развернуть" : "Свернуть"}</span>
                    </button>
                    {!collapsedBoards[key] ? (
                      <div className="mt-4 grid gap-3">
                        {items.slice(0, 3).map((item) => (
                          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                            <p className="text-sm text-stone-100">{item.title}</p>
                            <div className="mt-3 flex flex-wrap gap-2">
                              {item.links.slice(0, 4).map((link) => (
                                <Tag key={link}>{link}</Tag>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </GlassCard>
          ) : null}
        </div>
      </div>
    </section>
  );
}

function DMDashboard({ campaigns, pinnedItems, onOpenCampaign }) {
  const mainCampaign = campaigns[0];
  return (
    <section>
      <SectionTitle
        eyebrow="Мастер / Главная"
        title="Панель управления кампаниями"
        description="Следите за ближайшими сессиями, составом групп, состоянием кампаний и изменениями в игровом мире."
      />
      <div className="grid gap-6 xl:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <GlassCard className="overflow-hidden bg-[linear-gradient(135deg,rgba(143,47,35,0.25),rgba(255,255,255,0.03))]">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-end xl:justify-between">
              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Ближайшая сессия</p>
                <h4 className="mt-2 break-words font-display text-4xl text-parchment">{mainCampaign.nextSessionTitle}</h4>
                <p className="mt-4 break-words text-sm leading-7 text-stone-300">{mainCampaign.summary}</p>
              </div>
              <div className="grid min-w-0 gap-3 sm:grid-cols-3">
                <DashboardMetric label="Дата" value={mainCampaign.nextSessionDate} />
                <DashboardMetric label="Игроки" value={mainCampaign.players.length} />
                <DashboardMetric label="Статус" value={mainCampaign.status} />
              </div>
            </div>
          </GlassCard>

          <div className="grid gap-5 md:grid-cols-3">
            {campaigns.slice(0, 3).map((campaign) => (
              <button key={campaign.id} onClick={() => onOpenCampaign(campaign.id)} className="text-left">
                <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
                  <MapPinned className="h-5 w-5 text-amber-300" />
                  <p className="mt-4 text-xs uppercase tracking-[0.24em] text-stone-500">Кампания</p>
                  <p className="mt-2 break-words font-display text-3xl text-parchment">{campaign.name}</p>
                  <p className="mt-2 text-sm text-stone-400">{campaign.nextSessionDate}</p>
                </GlassCard>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Закреплённое</p>
            <div className="mt-5 space-y-3">
              {pinnedItems.map((item) => (
                <div key={item.id} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4">
                  <p className="truncate text-sm text-stone-100">{item.label}</p>
                  <p className="truncate text-xs text-stone-500">
                    {item.type} • {item.meta}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Активность мира</p>
            <div className="mt-5 space-y-3">
              {mainCampaign.activityLog.map((item) => (
                <div key={item} className="rounded-[22px] border border-white/10 bg-black/20 px-4 py-4 text-sm leading-7 text-stone-300">
                  {item}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function DMCampaignsPage({ campaigns, pinnedIds, onTogglePin, onOpenCampaign, onOpenCreateCampaign }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Мастер / Кампании"
        title="Кампании и мир"
        description="Управляйте кампаниями как системой связанных сущностей: карты, таймлайны, неигровые персонажи, фракции, отношения и скрытая информация собраны в одном рабочем пространстве."
        action={
          <button
            onClick={onOpenCreateCampaign}
            className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Создать кампанию
          </button>
        }
      />
      <div className="grid gap-6 xl:grid-cols-3">
        {campaigns.map((campaign) => (
          <button key={campaign.id} onClick={() => onOpenCampaign(campaign.id)} className="text-left">
            <GlassCard className="h-full transition-transform duration-300 hover:-translate-y-1">
              <div className={`rounded-[24px] border border-white/10 bg-gradient-to-br ${campaign.mapTint} p-4`}>
                <p className="text-xs uppercase tracking-[0.24em] text-parchment/70">Карта</p>
                <p className="mt-2 break-words font-display text-2xl text-parchment">{campaign.mapLabel}</p>
              </div>
              <div className="mt-5 flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <Tag tone="warm">{campaign.status}</Tag>
                  <h4 className="mt-3 break-words font-display text-3xl text-parchment">{campaign.name}</h4>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{campaign.summary}</p>
                </div>
                <button
                  onClick={(event) => {
                    event.stopPropagation();
                    onTogglePin(campaign.id);
                  }}
                  className={`rounded-2xl border p-2 ${
                    pinnedIds.includes(campaign.id)
                      ? "border-amber-400/30 bg-amber-500/10 text-amber-100"
                      : "border-white/10 bg-white/5 text-stone-300"
                  }`}
                >
                  <Pin className="h-4 w-4" />
                </button>
              </div>
              <div className="mt-5 flex flex-wrap gap-2">
                <Tag>{campaign.locations.length} локации</Tag>
                <Tag>{campaign.npcs.length} персонажа мира</Tag>
                <Tag>{campaign.organizations.length} организации</Tag>
              </div>
            </GlassCard>
          </button>
        ))}
      </div>
    </section>
  );
}

function WorldBuildingPage({ campaign, collapsedBoards, onToggleBoard }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Мастер / Сессии"
        title="Сессии"
        description="Рабочее пространство для планирования сюжета, создания неигровых персонажей, сюжетных нитей, сцен и редактирования таймлайна без визуального шума."
      />
      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="space-y-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Планирование сюжета</p>
            <div className="mt-5 space-y-3">
              {campaign.storyMoments.map((moment) => (
                <div key={moment} className="rounded-[22px] border border-white/10 bg-white/5 px-4 py-4 text-sm leading-7 text-stone-300">
                  {moment}
                </div>
              ))}
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Конструктор сцен</p>
            <div className="mt-5 grid gap-3">
              {campaign.sessionHistory.map((session) => (
                <div key={session.id} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                  <p className="text-sm text-stone-100">{session.title}</p>
                  <p className="mt-1 text-xs text-stone-500">{session.summary}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div className="space-y-6">
          <GlassCard>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Структурированные заметки</p>
              <Tag tone="green">Связано</Tag>
            </div>
            <div className="mt-5 grid gap-4 lg:grid-cols-3">
              <EntityCard title="Неигровые персонажи" items={campaign.npcs} />
              <EntityCard title="Локации" items={campaign.locations} />
              <EntityCard
                title="События"
                items={campaign.timeline.map((item) => ({
                  id: item.id,
                  name: item.title,
                  tag: item.date,
                  visibility: "visible",
                }))}
              />
            </div>
          </GlassCard>
          <GlassCard>
            <div className="flex items-center justify-between">
              <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Доска связей</p>
              <Tag tone="warm">Группы</Tag>
            </div>
            <div className="mt-5 space-y-4">
              {Object.entries(campaign.relationships).map(([key, items]) => (
                <div key={key} className="rounded-[24px] border border-white/10 bg-black/20 p-4">
                  <button onClick={() => onToggleBoard(key)} className="flex w-full items-center justify-between text-left">
                    <p className="text-sm text-stone-100">{relationshipTitle(key)}</p>
                    <span className="text-xs text-stone-500">{collapsedBoards[key] ? "Развернуть" : "Свернуть"}</span>
                  </button>
                  {!collapsedBoards[key] ? (
                    <div className="mt-4 grid gap-3">
                      {items.slice(0, 3).map((item) => (
                        <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                          <p className="text-sm text-stone-100">{item.title}</p>
                          <div className="mt-3 flex flex-wrap gap-2">
                            {item.links.slice(0, 4).map((link) => (
                              <Tag key={link}>{link}</Tag>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </div>
    </section>
  );
}

function AnalyticsPage({
  analytics,
  campaigns,
  selectedCampaignId,
  selectedSessionId,
  onSelectCampaign,
  onSelectSession,
  currentCampaign,
  currentSession,
}) {
  return (
    <section>
      <SectionTitle
        eyebrow="Мастер / Аналитика"
        title="Аналитика кампаний"
        description="Метрики теперь доступны и по кампании, и по конкретной сессии: активность игроков, смерти и уровень вовлечённости видны в разрезе реального игрового контекста."
      />
      <div className="mb-6 grid gap-4 md:grid-cols-2">
        <label className="block">
          <span className="mb-2 block text-sm text-stone-300">Кампания</span>
          <select
            value={selectedCampaignId}
            onChange={(event) => onSelectCampaign(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none"
          >
            {campaigns.map((campaign) => (
              <option key={campaign.id} value={campaign.id}>
                {campaign.name}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="mb-2 block text-sm text-stone-300">Сессия</span>
          <select
            value={selectedSessionId}
            onChange={(event) => onSelectSession(event.target.value)}
            className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none"
          >
            {currentCampaign.sessionHistory.map((session) => (
              <option key={session.id} value={session.id}>
                {session.title}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Самый активный игрок</p>
            <h4 className="mt-3 font-display text-4xl text-parchment">{analytics.mostActivePlayer.name}</h4>
            <p className="mt-3 text-sm text-stone-300">{analytics.mostActivePlayer.contribution}</p>
            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              <StatPill label="Кампания" value={currentCampaign.name} tone="warm" />
              <StatPill label="Сессия" value={currentSession.title} tone="blue" />
            </div>
          </GlassCard>
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Смерти</p>
            <div className="mt-5 space-y-4">
              {analytics.deathsPerPlayer.map((item) => (
                <div key={item.name}>
                  <div className="mb-2 flex items-center justify-between text-sm text-stone-200">
                    <span>{item.name}</span>
                    <span>{item.value}</span>
                  </div>
                  <ProgressBar value={item.value * 40} />
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
        <GlassCard>
          <p className="text-xs uppercase tracking-[0.3em] text-stone-500">Вовлечённость</p>
          <div className="mt-5 space-y-5">
            {analytics.engagement.map((item) => (
              <div key={item.name}>
                <div className="mb-2 flex items-center justify-between text-sm text-stone-200">
                  <span>{item.name}</span>
                  <span>{item.value}%</span>
                </div>
                <ProgressBar value={item.value} />
              </div>
            ))}
          </div>
        </GlassCard>
      </div>
    </section>
  );
}

function DMNotesPage({ notes, campaigns }) {
  return (
    <section>
      <SectionTitle
        eyebrow="Мастер / Заметки"
        title="Заметки"
        description="Структурируйте материалы по неигровым персонажам, сценам и событиям, связывайте их между собой и контролируйте видимость для игроков."
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {notes.map((note) => {
          const campaign = campaigns.find((item) => item.id === note.campaignId);
          return (
            <GlassCard key={note.id}>
              <div className="flex flex-wrap items-start justify-between gap-3">
                <Tag tone={note.visibility === "Hidden" ? "red" : "green"}>{visibilityLabel(note.visibility)}</Tag>
                <Users className="h-4 w-4 text-amber-300" />
              </div>
              <h4 className="mt-5 break-words font-display text-2xl text-parchment">{note.title}</h4>
              <p className="mt-2 break-words text-xs text-stone-500">{campaign?.name}</p>
              <p className="mt-3 break-words text-sm leading-7 text-stone-300">{note.text}</p>
              <div className="mt-5 rounded-[22px] border border-white/10 bg-black/20 p-4">
                <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Связанные сущности</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {note.linksTo.map((item) => (
                    <Tag key={item}>{item}</Tag>
                  ))}
                </div>
              </div>
            </GlassCard>
          );
        })}
      </div>
    </section>
  );
}

function CharacterWizardModal({
  wizard,
  wizardStep,
  onClose,
  onBack,
  onNext,
  onUpdate,
  onUpdateStats,
  onApplyQuickStats,
  onApplyRandomStats,
  onApplyManualDistribution,
  onRandomizeLanguages,
  onToggleLanguage,
  onGenerateAiStory,
  onFinish,
  currentClass,
}) {
  const steps = [
    "Класс",
    "Раса",
    "Языки",
    "Мировоззрение",
    "Характеристики",
    "Таланты",
    "Снаряжение",
    "Предыстория",
  ];

  return (
    <ModalShell title="Мастер создания персонажа" onClose={onClose} wide>
      <div className="mb-6 flex flex-wrap gap-2">
        {steps.map((label, index) => (
          <div
            key={label}
            className={`rounded-full px-3 py-2 text-xs ${
              index === wizardStep
                ? "bg-amber-500/15 text-amber-100"
                : index < wizardStep
                  ? "bg-emerald-500/15 text-emerald-100"
                  : "bg-white/5 text-stone-500"
            }`}
          >
            {index + 1}. {label}
          </div>
        ))}
      </div>

      {wizardStep === 0 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {DND_CLASSES.map((item) => (
            <button
              key={item.name}
              onClick={() => onApplyQuickStats(item.name)}
              className={`rounded-[24px] border p-4 text-left ${
                wizard.classKey === item.name
                  ? "border-amber-400/20 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <h4 className="font-display text-2xl text-parchment">{item.ru}</h4>
              <p className="mt-2 text-sm leading-7 text-stone-300">{item.description}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Tag tone="warm">d{item.hitDie}</Tag>
                <Tag>Базовое HP: {item.fixedHp}</Tag>
              </div>
            </button>
          ))}
          <div className="lg:col-span-2 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Расчёт HP</p>
            <div className="mt-4 flex gap-2">
              <button
                onClick={() => onUpdate({ hpMode: "random" })}
                className={`rounded-2xl px-4 py-2 text-sm ${
                  wizard.hpMode === "random"
                    ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                    : "border border-white/10 bg-white/5 text-stone-300"
                }`}
              >
              Случайно (симуляция бросков)
              </button>
              <button
                onClick={() => onUpdate({ hpMode: "fixed" })}
                className={`rounded-2xl px-4 py-2 text-sm ${
                  wizard.hpMode === "fixed"
                    ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                    : "border border-white/10 bg-white/5 text-stone-300"
                }`}
              >
              Фиксированное значение
              </button>
            </div>
          </div>
        </div>
      ) : null}

      {wizardStep === 1 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {RACES.map((race) => (
            <button
              key={race.name}
              onClick={() => onUpdate({ race: race.ru })}
              className={`rounded-[24px] border p-4 text-left ${
                wizard.race === race.ru ? "border-amber-400/20 bg-amber-500/10" : "border-white/10 bg-white/5"
              }`}
            >
              <h4 className="font-display text-2xl text-parchment">{race.ru}</h4>
              <p className="mt-2 text-sm leading-7 text-stone-300">{race.description}</p>
            </button>
          ))}
          <div className="lg:col-span-2 rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Пол персонажа</p>
            <div className="mt-4 flex gap-2">
              {[
                { id: "male", label: "Мужской" },
                { id: "female", label: "Женский" },
              ].map((option) => (
                <button
                  key={option.id}
                  onClick={() => onUpdate({ gender: option.id })}
                  className={`rounded-2xl px-4 py-2 text-sm ${
                    wizard.gender === option.id
                      ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                      : "border border-white/10 bg-white/5 text-stone-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}

      {wizardStep === 2 ? (
        <div className="grid gap-4">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ languagesMode: "random" })}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.languagesMode === "random"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
                Случайно
            </button>
            <button
              onClick={() => onUpdate({ languagesMode: "manual" })}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.languagesMode === "manual"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
                Выбрать вручную
            </button>
            {wizard.languagesMode === "random" ? (
              <button
                onClick={onRandomizeLanguages}
                className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-stone-200"
              >
                <WandSparkles className="h-4 w-4" />
                Случайный набор
              </button>
            ) : null}
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            {LANGUAGES.map((language) => (
              <label key={language} className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
                <input
                  type="checkbox"
                  checked={wizard.languages.includes(language)}
                  onChange={() => onToggleLanguage(language)}
                  disabled={wizard.languagesMode === "random"}
                />
                <span className="text-sm text-stone-200">{language}</span>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {wizardStep === 3 ? (
        <div className="grid gap-4 lg:grid-cols-3">
          {ALIGNMENTS.map((alignment) => (
            <button
              key={alignment.name}
              onClick={() => onUpdate({ alignment: alignment.ru })}
              className={`rounded-[24px] border p-4 text-left ${
                wizard.alignment === alignment.ru
                  ? "border-amber-400/20 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <h4 className="font-display text-2xl text-parchment">{alignment.ru}</h4>
              <p className="mt-2 text-sm leading-7 text-stone-300">{alignment.description}</p>
            </button>
          ))}
        </div>
      ) : null}

      {wizardStep === 4 ? (
        <div className="grid gap-5">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => {
                onUpdate({ abilitiesMode: "quick" });
                onApplyQuickStats(wizard.classKey);
              }}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.abilitiesMode === "quick"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
              Быстрая настройка
            </button>
            <button
              onClick={() => {
                onUpdate({ abilitiesMode: "random" });
                onApplyRandomStats();
              }}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.abilitiesMode === "random"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
              Случайные значения
            </button>
            <button
              onClick={() => {
                onUpdate({ abilitiesMode: "manual" });
                onApplyManualDistribution();
              }}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.abilitiesMode === "manual"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
              Ручное распределение
            </button>
          </div>
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3">
            {Object.entries(wizard.stats).map(([stat, value]) => (
              <label key={stat} className="rounded-[22px] border border-white/10 bg-black/20 p-4">
                <span className="text-xs uppercase tracking-[0.24em] text-stone-500">{stat}</span>
                <input
                  type="number"
                  value={value}
                  onChange={(event) => onUpdateStats({ [stat]: Number(event.target.value) })}
                  className="mt-3 w-full bg-transparent text-2xl text-stone-100 outline-none"
                />
                <p className="text-xs text-stone-500">Мод.: {formatModifier(calculateModifier(value))}</p>
              </label>
            ))}
          </div>
        </div>
      ) : null}

      {wizardStep === 5 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {FEATS.map((feat) => (
            <button
              key={feat.name}
              onClick={() => onUpdate({ feat: feat.name })}
              className={`rounded-[24px] border p-4 text-left ${
                wizard.feat === feat.name ? "border-amber-400/20 bg-amber-500/10" : "border-white/10 bg-white/5"
              }`}
            >
              <h4 className="font-display text-2xl text-parchment">{feat.name}</h4>
              <p className="mt-2 text-sm leading-7 text-stone-300">{feat.description}</p>
            </button>
          ))}
        </div>
      ) : null}

      {wizardStep === 6 ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {EQUIPMENT_PACKS.map((pack) => (
            <button
              key={pack.name}
              onClick={() => onUpdate({ equipmentPack: pack.name })}
              className={`rounded-[24px] border p-4 text-left ${
                wizard.equipmentPack === pack.name
                  ? "border-amber-400/20 bg-amber-500/10"
                  : "border-white/10 bg-white/5"
              }`}
            >
              <h4 className="font-display text-2xl text-parchment">{pack.name}</h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {pack.items.map((item) => (
                  <Tag key={item}>{item}</Tag>
                ))}
              </div>
            </button>
          ))}
          <div className="lg:col-span-2">
            <label className="block">
              <span className="mb-2 block text-sm text-stone-300">Дополнительная кастомизация</span>
              <input
                value={wizard.extraEquipment}
                onChange={(event) => onUpdate({ extraEquipment: event.target.value })}
                placeholder="Например: семейный медальон, алхимический набор, набор отмычек"
                className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
              />
            </label>
          </div>
        </div>
      ) : null}

      {wizardStep === 7 ? (
        <div className="grid gap-5">
          <div className="flex gap-2">
            <button
              onClick={() => onUpdate({ backgroundMode: "preset" })}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.backgroundMode === "preset"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
              Пресеты
            </button>
            <button
              onClick={() => onUpdate({ backgroundMode: "custom" })}
              className={`rounded-2xl px-4 py-2 text-sm ${
                wizard.backgroundMode === "custom"
                  ? "bg-gradient-to-r from-amber-500 to-red-700 text-white"
                  : "border border-white/10 bg-white/5 text-stone-300"
              }`}
            >
              Свой вариант
            </button>
          </div>
          {wizard.backgroundMode === "preset" ? (
            <div className="grid gap-4 lg:grid-cols-2">
              {BACKGROUND_PRESETS.map((preset) => (
                <button
                  key={preset}
                  onClick={() => onUpdate({ backgroundPreset: preset, generatedStory: preset })}
                  className={`rounded-[24px] border p-4 text-left ${
                    wizard.backgroundPreset === preset
                      ? "border-amber-400/20 bg-amber-500/10"
                      : "border-white/10 bg-white/5"
                  }`}
                >
                  <p className="text-sm leading-7 text-stone-300">{preset}</p>
                </button>
              ))}
            </div>
          ) : (
            <textarea
              rows="4"
              value={wizard.generatedStory}
              onChange={(event) => onUpdate({ generatedStory: event.target.value })}
              className="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-stone-100 outline-none"
            />
          )}
          <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
            <p className="text-xs uppercase tracking-[0.24em] text-stone-500">Генератор истории</p>
            <textarea
              rows="3"
              value={wizard.backgroundPrompt}
              onChange={(event) => onUpdate({ backgroundPrompt: event.target.value })}
              placeholder="Например: Моя семья пропала в другом королевстве..."
              className="mt-4 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-stone-100 outline-none"
            />
            <button
              onClick={onGenerateAiStory}
              className="mt-4 inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white"
            >
              <WandSparkles className="h-4 w-4" />
              Сгенерировать историю
            </button>
            <div className="mt-4 rounded-[22px] border border-white/10 bg-white/5 p-4 text-sm leading-7 text-stone-300">
              {wizard.generatedStory}
            </div>
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex items-center justify-between">
        <div className="text-sm text-stone-500">
          {wizardStep + 1} / {steps.length} • {currentClass.ru}
        </div>
        <div className="flex gap-2">
          <button
            onClick={onBack}
            disabled={wizardStep === 0}
            className="inline-flex items-center gap-2 rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-stone-200 disabled:opacity-40"
          >
            <ChevronLeft className="h-4 w-4" />
            Назад
          </button>
          {wizardStep < steps.length - 1 ? (
            <button
              onClick={onNext}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white"
            >
              Далее
              <ChevronRight className="h-4 w-4" />
            </button>
          ) : (
            <button
              onClick={onFinish}
              className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-amber-500 to-red-700 px-4 py-3 text-sm font-medium text-white"
            >
              <ShieldPlus className="h-4 w-4" />
              Завершить создание
            </button>
          )}
        </div>
      </div>
    </ModalShell>
  );
}

function ModalShell({ title, children, onClose, wide = false }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className={`max-h-[92vh] overflow-y-auto rounded-[32px] border border-white/10 bg-[#120d0f] p-6 shadow-2xl ${wide ? "w-full max-w-6xl" : "w-full max-w-3xl"}`}>
        <div className="mb-6 flex items-center justify-between gap-3">
          <h3 className="font-display text-3xl text-parchment">{title}</h3>
          <button onClick={onClose} className="rounded-2xl border border-white/10 bg-white/5 p-2 text-stone-300">
            <X className="h-4 w-4" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

function EntityCard({ title, items }) {
  return (
    <div className="rounded-[24px] border border-white/10 bg-black/20 p-4">
      <p className="text-xs uppercase tracking-[0.24em] text-stone-500">{title}</p>
      <div className="mt-4 space-y-3">
        {items.map((item) => (
          <div key={item.id ?? item.name} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <p className="min-w-0 flex-1 break-words text-sm text-stone-100">{item.name}</p>
              <Tag
                tone={item.visibility === "hidden" || item.visibility === "Hidden" ? "red" : "green"}
              >
                {visibilityLabel(item.visibility)}
              </Tag>
            </div>
            <p className="mt-1 break-words text-xs text-stone-500">{item.tag ?? item.role ?? item.relation}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function DashboardMetric({ label, value }) {
  return (
    <div className="min-w-0 rounded-[22px] border border-white/10 bg-black/20 px-4 py-4">
      <p className="text-[11px] uppercase tracking-[0.24em] text-stone-500">{label}</p>
      <p className="mt-2 break-words text-xl font-semibold text-stone-100">{value}</p>
    </div>
  );
}

function buildFullSkills(stats) {
  const byStat = {
    СИЛ: ["Атлетика"],
    ЛОВ: ["Акробатика", "Ловкость рук", "Скрытность"],
    ИНТ: ["История", "Природа", "Расследование", "Религия", "Тайная магия"],
    МДР: ["Восприятие", "Выживание", "Медицина", "Обращение с животными", "Проницательность"],
    ХАР: ["Выступление", "Запугивание", "Обман", "Убеждение"],
  };

  return Object.entries(byStat).reduce((accumulator, [stat, skills]) => {
    skills.forEach((skill) => {
      accumulator[skill] = calculateModifier(stats[stat] ?? 10);
    });
    return accumulator;
  }, {});
}

function calculateModifier(stat) {
  return Math.floor((Number(stat) - 10) / 2);
}

function formatModifier(value) {
  return value >= 0 ? `+${value}` : `${value}`;
}

function relationshipTitle(key) {
  const labels = {
    locations: "Группы локаций",
    factions: "Фракции и силы",
    secrets: "Секреты и скрытые узлы",
  };
  return labels[key] ?? key;
}

function visibilityLabel(value) {
  const labels = {
    visible: "Всем",
    Visible: "Всем",
    hidden: "Скрыто",
    Hidden: "Скрыто",
    shared: "Общее",
    selected: "Выборочно",
  };
  return labels[value] ?? value;
}

function rollHitPoints(hitDie, level, conModifier) {
  let total = hitDie + conModifier;
  for (let index = 1; index < level; index += 1) {
    total += 1 + Math.floor(Math.random() * hitDie) + conModifier;
  }
  return Math.max(total, level);
}

function renderRuleContent(text, onSelectRule) {
  const glossaryKeys = Object.keys(RULE_GLOSSARY).sort((a, b) => b.length - a.length);
  const escapedKeys = glossaryKeys.map((key) => key.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"));
  const matcher = new RegExp(`(${escapedKeys.join("|")})`, "gi");
  const parts = text.split(matcher);

  return parts.map((part, index) => {
    const glossary = RULE_GLOSSARY[part.toLowerCase()];
    if (!glossary) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <button
        key={`${part}-${index}`}
        onClick={() => onSelectRule(glossary.ruleId)}
        className="group relative inline text-amber-200 underline decoration-dotted underline-offset-4"
      >
        {part}
        <span className="pointer-events-none absolute left-0 top-full z-20 hidden w-72 rounded-2xl border border-white/10 bg-[#120d0f] p-4 text-left text-xs leading-6 text-stone-300 shadow-2xl group-hover:block">
          <span className="block text-sm text-parchment">{glossary.label}</span>
          <span className="mt-1 block">{glossary.hint}</span>
          <span className="mt-2 block text-[11px] uppercase tracking-[0.24em] text-amber-100">
            Нажмите, чтобы открыть статью
          </span>
        </span>
      </button>
    );
  });
}
