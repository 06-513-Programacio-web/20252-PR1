/**
 * =============================================================================
 * PROGRAMACIÓN WEB - PRÁCTICA 1
 * Gestión de Anime con JavaScript
 * =============================================================================
 *
 * Este archivo implementa las 8 etapas de la práctica utilizando:
 *   - Clases con getters y setters
 *   - Métodos de clase y funciones flecha
 *   - Recursividad, reduce, map, filter
 *   - Destructuring y spread operator
 *
 * Convenciones seguidas:
 *   - Se usa `const` para valores que no cambian y `let` para los que sí.
 *   - Las funciones anónimas se escriben como arrow functions.
 *   - Los nombres siguen camelCase (variables/funciones) y PascalCase (clases).
 *   - Las comparaciones son siempre estrictas (=== / !==).
 *   - Se usan métodos de Array (map, filter, reduce, sort, find, etc.)
 *     en lugar de bucles for/while siempre que sea posible.
 *   - Los comentarios siguen el estilo de las 9 reglas de Ellen Spertus:
 *     explicar el "por qué", no el "qué" evidente en el código.
 * =============================================================================
 */

/* =============================================================================
   ETAPA 1 — Clase Anime (5 puntos)
   Representa un único anime con todos sus datos relevantes.
   Incluye getters para leer propiedades y setters con validación básica.
   ============================================================================= */

class Anime {
  /**
   * Constructor de la clase Anime.
   * Recibe un objeto con las propiedades del anime tal y como las devuelve
   * la API de Jikan, lo que facilita crear instancias directamente desde
   * la respuesta de la API en la PRA2.
   *
   * @param {Object} params - Objeto con los datos del anime.
   * @param {number} params.mal_id     - ID único en MyAnimeList.
   * @param {string} params.title      - Título en inglés.
   * @param {string} params.synopsis   - Sinopsis.
   * @param {number} params.episodes      - Número de episodios.
   * @param {string} params.status        - Estado de emisión.
   * @param {number} params.score         - Puntuación (0-10).
   * @param {string} params.type          - Tipo (TV, Movie, OVA…).
   * @param {Array}  params.genres        - Array de géneros (objetos).
   * @param {Array}  params.studios       - Array de estudios (objetos).
   * @param {string} params.image_url     - URL de la imagen principal.
   * @param {number} params.popularity    - Ranking de popularidad.
   */
  constructor({
    mal_id,
    title,
    synopsis,
    episodes,
    status,
    score,
    type,
    genres,
    studios,
    image_url,
    popularity,
  }) {
    // Usamos propiedades privadas (convención con _) para obligar el acceso
    // a través de getters/setters y poder añadir validaciones centralizadas.
    this._mal_id = mal_id;
    this._title = title;
    this._synopsis = synopsis;
    this._episodes = episodes;
    this._status = status;
    this._score = score;
    this._type = type;
    this._genres = genres ?? []; // Si no hay géneros, se inicializa como array vacío
    this._studios = studios ?? [];
    this._image_url = image_url;
    this._popularity = popularity;
  }

  // ── Getters ──────────────────────────────────────────────────────────────
  get mal_id() { return this._mal_id; }
  get title() { return this._title; }
  get synopsis() { return this._synopsis; }
  get episodes() { return this._episodes; }
  get status() { return this._status; }
  get score() { return this._score; }
  get type() { return this._type; }
  get genres() { return this._genres; }
  get studios() { return this._studios; }
  get image_url() { return this._image_url; }
  get popularity() { return this._popularity; }

  // ── Setters con validación básica ────────────────────────────────────────

  /** El título no puede ser una cadena vacía. */
  set title(newTitle) {
    if (typeof newTitle === 'string' && newTitle.trim() !== '') {
      this._title = newTitle;
    } else {
      console.warn('El título debe ser una cadena de texto no vacía.');
    }
  }

  /**
   * La puntuación debe estar en el rango permitido (0-10).
   * Rechazamos valores fuera de rango para mantener la integridad de los datos.
   */
  set score(newScore) {
    if (typeof newScore === 'number' && newScore >= 0 && newScore <= 10) {
      this._score = newScore;
    } else {
      console.warn('La puntuación debe ser un número entre 0 y 10.');
    }
  }

  /** El número de episodios debe ser un entero positivo o null (en emisión). */
  set episodes(newEpisodes) {
    if (newEpisodes === null || (Number.isInteger(newEpisodes) && newEpisodes > 0)) {
      this._episodes = newEpisodes;
    } else {
      console.warn('Los episodios deben ser un entero positivo o null.');
    }
  }

  set status(newStatus) { this._status = newStatus; }
  set type(newType) { this._type = newType; }
  set genres(newGenres) { this._genres = Array.isArray(newGenres) ? newGenres : []; }
  set studios(newStudios) { this._studios = Array.isArray(newStudios) ? newStudios : []; }
  set image_url(newUrl) { this._image_url = newUrl; }
  set popularity(newPop) { this._popularity = newPop; }
  set synopsis(newSynopsis) { this._synopsis = newSynopsis; }
}


/* =============================================================================
   ETAPA 2 — Clase AnimeList (5 puntos)
   Gestiona una colección de objetos Anime.
   Actúa como un contenedor inteligente con métodos de gestión de la lista.
   ============================================================================= */

class AnimeList {
  /**
   * Inicializa la lista como un array vacío.
   * Separamos la lista interna (_animes) de la lógica de negocio (métodos)
   * para seguir el principio de encapsulación.
   */
  constructor() {
    this._animes = [];
  }

  /** Devuelve el array interno (solo lectura). */
  get animes() { return this._animes; }

  /**
   * Agrega un anime a la lista.
   * Comprobamos duplicados por mal_id para evitar añadir el mismo anime dos veces,
   * lo que podría causar inconsistencias en las estadísticas y listas.
   *
   * @param {Anime} anime - Instancia de la clase Anime a añadir.
   */
  addAnime(anime) {
    // Solo añadimos si el objeto es una instancia de Anime y no es un duplicado
    if (!(anime instanceof Anime)) {
      console.warn('Solo se pueden añadir instancias de la clase Anime.');
      return;
    }
    const existe = this._animes.some(a => a.mal_id === anime.mal_id);
    if (existe) {
      console.warn(`El anime con ID ${anime.mal_id} ya existe en la lista.`);
      return;
    }
    this._animes.push(anime);
  }

  /**
   * Elimina un anime de la lista por su mal_id.
   * Utilizamos filter en lugar de splice porque es más declarativo y no muta
   * el array de forma directa con índices, reduciendo errores.
   *
   * Validamos que el ID sea un número entero positivo antes de operar,
   * ya que un ID inválido nunca coincidirá con nada y podría enmascarar
   * un error de uso en el código llamante.
   *
   * @param {number} animeId - mal_id del anime a eliminar.
   */
  removeAnime(animeId) {
    // El ID debe ser un número entero estrictamente positivo
    if (typeof animeId !== 'number' || !Number.isInteger(animeId) || animeId <= 0) {
      console.warn(`removeAnime: el ID debe ser un número entero positivo. Recibido: ${animeId}`);
      return;
    }

    const longitudAnterior = this._animes.length;
    this._animes = this._animes.filter(a => a.mal_id !== animeId);

    // Informamos si no se encontró el anime para facilitar la depuración
    if (this._animes.length === longitudAnterior) {
      console.warn(`No se encontró ningún anime con ID ${animeId}.`);
    } else {
      console.log(`Anime con ID ${animeId} eliminado correctamente.`);
    }
  }

  /**
   * Muestra por consola la información básica de cada anime de la lista.
   * Usamos forEach porque solo nos interesa el efecto secundario (imprimir),
   * no transformar el array.
   */
  showList() {
    if (this._animes.length === 0) {
      console.log('La lista está vacía.');
      return;
    }
    console.log(`\n📋 Lista de anime (${this._animes.length} elementos):`);
    console.log('─'.repeat(50));
    this._animes.forEach((anime, index) => {
      console.log(`${index + 1}. ${anime.title}`);
      console.log(`   Tipo: ${anime.type} | Puntuación: ${anime.score} | Imagen: ${anime.image_url}`);
    });
    console.log('─'.repeat(50));
  }

  /* ===========================================================================
     ETAPA 3 — Funciones flecha dentro de AnimeList (5 puntos)
     Estas arrow functions forman parte de la clase porque operan directamente
     sobre la lista interna (_animes) y son reutilizables en el contexto de
     la gestión de la colección.
     =========================================================================== */

  /**
   * Agrega múltiples anime a la vez usando el operador rest (...animes).
   * El operador rest convierte los argumentos individuales en un array,
   * permitiendo llamar a addAnime para cada uno sin repetir código.
   * Rechazamos la llamada si no se pasa ningún argumento, ya que una
   * invocación vacía no tiene sentido y puede indicar un error de uso.
   *
   * @param {...Anime} animes - Uno o más instancias Anime.
   */
  addMultipleAnimes = (...animes) => {
    // El operador rest siempre genera un array; comprobamos que no esté vacío
    if (animes.length === 0) {
      console.warn('addMultipleAnimes: debes pasar al menos un anime como argumento.');
      return;
    }
    animes.forEach(anime => this.addAnime(anime));
  };

  /**
   * Filtra los anime según un rango de puntuación [minScore, maxScore].
   * Devuelve un nuevo array sin modificar la lista original,
   * lo que garantiza la inmutabilidad de los datos.
   *
   * Validamos los parámetros antes de filtrar para evitar resultados
   * vacíos o inconsistentes debidos a entradas incorrectas.
   *
   * @param {number} minScore - Puntuación mínima (inclusiva, >= 0).
   * @param {number} maxScore - Puntuación máxima (inclusiva, >= minScore).
   * @returns {Anime[]|null} Array filtrado, o null si los parámetros son inválidos.
   */
  getAnimesByScoreRange = (minScore, maxScore) => {
    // Ambos valores deben ser números
    if (typeof minScore !== 'number' || typeof maxScore !== 'number') {
      console.warn('getAnimesByScoreRange: minScore y maxScore deben ser números.');
      return null;
    }
    // Las puntuaciones no pueden ser negativas (el rango MAL es 0-10)
    if (minScore < 0 || maxScore < 0) {
      console.warn('getAnimesByScoreRange: minScore y maxScore deben ser mayores o iguales a 0.');
      return null;
    }
    // El límite superior no puede ser menor que el inferior
    if (maxScore < minScore) {
      console.warn(`getAnimesByScoreRange: maxScore (${maxScore}) no puede ser menor que minScore (${minScore}).`);
      return null;
    }

    return this._animes.filter(
      anime => anime.score >= minScore && anime.score <= maxScore
    );
  };

  /**
   * Ordena los anime de la lista por popularidad, del más popular (rank 1)
   * al menos popular (rank más alto).
   * ATENCIÓN: sort muta el array original. Si quisiéramos preservarlo,
   * usaríamos [...this._animes].sort(...), pero aquí ordenamos in-place
   * porque el enunciado pide "ordenar la lista".
   *
   * @returns {Anime[]} La lista ordenada (misma referencia).
   */
  sortAnimesByPopularity = () => {
    // Un número de popularidad menor indica mayor popularidad (rank 1 = el más popular)
    this._animes.sort((a, b) => a.popularity - b.popularity);
    return this._animes;
  };
}


/* =============================================================================
   ETAPA 4 — Función recursiva: findAnimeById (5 puntos)
   Busca un anime dentro de una AnimeList por su mal_id.

   ¿Por qué una función externa en lugar de un método de clase?
   El enunciado no especifica que deba estar en la clase, y conceptualmente
   es una utilidad de búsqueda genérica. La hacemos externa para que pueda
   reutilizarse con cualquier AnimeList sin estar atada a una instancia.
   ============================================================================= */

/**
 * Busca recursivamente un anime en una AnimeList por su mal_id.
 *
 * La recursividad aquí divide el problema: comprueba el primer elemento
 * y, si no coincide, llama a sí misma con el resto del array.
 * El caso base es: array vacío (no encontrado) o primer elemento coincide.
 *
 * Validamos los parámetros en la primera llamada (index === 0) para no
 * repetir la comprobación en cada paso recursivo, lo que sería ineficiente.
 *
 * @param {AnimeList} animeList  - La lista donde buscar.
 * @param {number}    mal_id     - El ID a buscar (entero positivo).
 * @param {number}    [index=0]  - Índice actual (se incrementa en cada llamada).
 * @returns {Anime|null} El anime encontrado o null si no existe.
 */
const findAnimeById = (animeList, mal_id, index = 0) => {
  // Validamos los parámetros solo en la llamada inicial para no penalizar la recursión
  if (index === 0) {
    if (!(animeList instanceof AnimeList)) {
      console.warn('findAnimeById: el primer argumento debe ser una instancia de AnimeList.');
      return null;
    }
    if (typeof mal_id !== 'number' || !Number.isInteger(mal_id) || mal_id <= 0) {
      console.warn(`findAnimeById: el ID debe ser un número entero positivo. Recibido: ${mal_id}`);
      return null;
    }
  }

  const animes = animeList.animes;

  // Caso base 1: hemos recorrido toda la lista sin encontrar el anime
  if (index >= animes.length) return null;

  // Caso base 2: el elemento actual coincide con el ID buscado
  if (animes[index].mal_id === mal_id) return animes[index];

  // Caso recursivo: avanzamos al siguiente elemento
  return findAnimeById(animeList, mal_id, index + 1);
};


/* =============================================================================
   ETAPA 5 — Uso de reduce: getMostCommonGenre (5 puntos)
   Determina el género más repetido en toda la lista de anime.
   ============================================================================= */

/**
 * Analiza todos los géneros de todos los anime de la lista y devuelve
 * el nombre del género más frecuente.
 *
 * Estrategia:
 *   1. Usamos reduce para "aplanar" todos los géneros en un único contador
 *      (objeto clave→frecuencia).
 *   2. Con Object.entries y reduce obtenemos el de máxima frecuencia.
 *
 * @param {AnimeList} animeList - Lista de anime a analizar.
 * @returns {string} Nombre del género más común.
 */
const getMostCommonGenre = (animeList) => {
  // Comprobamos que el argumento sea una instancia válida de AnimeList
  if (!(animeList instanceof AnimeList)) {
    console.warn('getMostCommonGenre: el argumento debe ser una instancia de AnimeList.');
    return null;
  }

  const animes = animeList.animes;

  if (animes.length === 0) {
    console.warn('getMostCommonGenre: la lista está vacía, no hay géneros que analizar.');
    return null;
  }

  // Comprobamos que al menos un anime tenga géneros definidos
  const hayGeneros = animes.some(a => a.genres.length > 0);
  if (!hayGeneros) {
    console.warn('getMostCommonGenre: ningún anime de la lista tiene géneros asignados.');
    return null;
  }

  /**
   * Acumulamos la frecuencia de cada género en un objeto.
   * El acumulador (contador) tiene la forma { 'Action': 5, 'Comedy': 3, ... }.
   * Por cada anime, iteramos sus géneros y sumamos 1 a cada uno.
   */
  const contador = animes.reduce((acum, anime) => {
    anime.genres.forEach(genero => {
      // Si el género ya existe en el acumulador lo incrementamos, si no lo inicializamos a 1
      acum[genero.name] = (acum[genero.name] ?? 0) + 1;
    });
    return acum;
  }, {}); // Valor inicial: objeto vacío

  // Convertimos el objeto a un array de pares [nombre, frecuencia] y buscamos el máximo
  const [generoMasComun] = Object.entries(contador).reduce(
    (max, entrada) => (entrada[1] > max[1] ? entrada : max)
  );

  return generoMasComun;
};


/* =============================================================================
   ETAPA 6 — Uso de map y filter: getHighRatedAnimes (5 puntos)
   Devuelve los títulos de los anime con puntuación >= minScore.
   ============================================================================= */

/**
 * Filtra los anime con puntuación mayor o igual a minScore y devuelve
 * únicamente sus títulos.
 *
 * Se usa filter primero para reducir el array antes de aplicar map,
 * evitando transformaciones innecesarias en elementos que se descartarán.
 *
 * @param {Anime[]} animesArray - Array de objetos Anime.
 * @param {number}  minScore    - Puntuación mínima requerida.
 * @returns {string[]} Array de títulos.
 */
const getHighRatedAnimes = (animesArray, minScore) => {
  // El primer argumento debe ser un array (puede estar vacío, eso es válido)
  if (!Array.isArray(animesArray)) {
    console.warn('getHighRatedAnimes: el primer argumento debe ser un array de anime.');
    return null;
  }
  // minScore debe ser un número en el rango válido de puntuaciones MAL
  if (typeof minScore !== 'number' || minScore < 0 || minScore > 10) {
    console.warn('getHighRatedAnimes: minScore debe ser un número entre 0 y 10.');
    return null;
  }

  return animesArray
    .filter(anime => anime.score >= minScore)  // Seleccionamos los que cumplen la condición
    .map(anime => anime.title);                 // Extraemos solo el título
};


/* =============================================================================
   ETAPA 7 — Destructuring y spread: getAnimeInfo (5 puntos)
   Muestra información organizada de un anime y crea un objeto enriquecido.
   ============================================================================= */

/**
 * Extrae y muestra información relevante de un anime usando destructuring,
 * y devuelve un nuevo objeto con todos los datos originales más el campo
 * 'fullInfo: true' usando el operador spread.
 *
 * Usamos destructuring para hacer el código más legible: en lugar de
 * anime.genres[0], escribimos directamente primerGenero, lo que deja
 * claro qué datos nos interesan desde el principio de la función.
 *
 * @param {Anime} anime - Instancia de Anime a inspeccionar.
 * @returns {Object} Nuevo objeto con los datos del anime y fullInfo: true.
 */
const getAnimeInfo = (anime) => {
  // Comprobamos que el argumento sea una instancia de Anime antes de desestructurar,
  // ya que el destructuring fallaría silenciosamente con un objeto genérico
  if (!(anime instanceof Anime)) {
    console.warn('getAnimeInfo: el argumento debe ser una instancia de la clase Anime.');
    return null;
  }

  // Destructuring: extraemos las propiedades que nos interesan del objeto anime
  const {
    title,
    type,
    score,
    genres: [primerGenero] = [],    // Extraemos el primer elemento del array genres
    studios: [primerEstudio] = [],  // Extraemos el primer elemento del array studios
  } = anime;

  // Mostramos la información de forma organizada en la consola
  console.log('\n📌 Información del anime:');
  console.log(`  Título:         ${title}`);
  console.log(`  Tipo:           ${type}`);
  console.log(`  Puntuación:     ${score}`);
  console.log(`  Primer género:  ${primerGenero?.name ?? 'Sin género'}`);
  console.log(`  Primer estudio: ${primerEstudio?.name ?? 'Sin estudio'}`);

  // Creamos un nuevo objeto con spread: copiamos todo el anime y añadimos fullInfo
  // Usamos spread en lugar de Object.assign para mantener la inmutabilidad
  const animeConFullInfo = { ...anime, fullInfo: true };

  return animeConFullInfo;
};


/* =============================================================================
   ETAPA 8 — Función avanzada: getAnimesByStudio (5 puntos)
   Combina filter, map y reduce para obtener estadísticas por estudio.
   ============================================================================= */

/**
 * Filtra los anime producidos por un estudio concreto y devuelve un resumen
 * con el nombre del estudio, cantidad de anime, sus títulos y la puntuación media.
 *
 * Flujo:
 *   1. filter  → descarta anime que no pertenecen al estudio.
 *   2. map     → extrae solo los títulos.
 *   3. reduce  → calcula la media de puntuaciones.
 *
 * @param {Anime[]} animesArray  - Array de objetos Anime donde buscar.
 * @param {string}  nombreEstudio - Nombre del estudio a buscar.
 * @returns {Object} { studio, count, animes, averageScore }
 */
const getAnimesByStudio = (animesArray, nombreEstudio) => {
  // Validamos el array de entrada
  if (!Array.isArray(animesArray)) {
    console.warn('getAnimesByStudio: el primer argumento debe ser un array de anime.');
    return null;
  }
  // El nombre del estudio debe ser una cadena no vacía
  if (typeof nombreEstudio !== 'string' || nombreEstudio.trim() === '') {
    console.warn('getAnimesByStudio: el nombre del estudio debe ser una cadena de texto no vacía.');
    return null;
  }
  // Paso 1: filtramos los anime cuyo array de estudios incluye el estudio buscado
  // Usamos comparación case-insensitive para mayor tolerancia en los datos
  const animesFiltrados = animesArray.filter(anime =>
    anime.studios.some(
      estudio => estudio.name.toLowerCase() === nombreEstudio.toLowerCase()
    )
  );

  // Paso 2: extraemos los títulos usando map
  const titulos = animesFiltrados.map(anime => anime.title);

  // Paso 3: calculamos la puntuación media usando reduce
  // Evitamos dividir entre 0 si no hay resultados
  const puntuacionMedia = animesFiltrados.length > 0
    ? animesFiltrados.reduce((suma, anime) => suma + anime.score, 0) / animesFiltrados.length
    : 0;

  return {
    studio: nombreEstudio,
    count: animesFiltrados.length,
    animes: titulos,
    // Redondeamos a 2 decimales para una presentación más limpia
    averageScore: Math.round(puntuacionMedia * 100) / 100,
  };
};


/* =============================================================================
   DATOS DE PRUEBA
   Los siguientes datos son reales (extraídos de MyAnimeList / Jikan API)
   y se usan para validar todas las funciones implementadas arriba.
   ============================================================================= */

// ── Géneros reutilizables (objetos con la estructura de Jikan) ──────────────
const G_ACTION     = { mal_id: 1,  type: 'anime', name: 'Action',     url: 'https://myanimelist.net/anime/genre/1/Action' };
const G_ADVENTURE  = { mal_id: 2,  type: 'anime', name: 'Adventure',  url: 'https://myanimelist.net/anime/genre/2/Adventure' };
const G_COMEDY     = { mal_id: 4,  type: 'anime', name: 'Comedy',     url: 'https://myanimelist.net/anime/genre/4/Comedy' };
const G_DRAMA      = { mal_id: 8,  type: 'anime', name: 'Drama',      url: 'https://myanimelist.net/anime/genre/8/Drama' };
const G_FANTASY    = { mal_id: 10, type: 'anime', name: 'Fantasy',    url: 'https://myanimelist.net/anime/genre/10/Fantasy' };
const G_SCIFI      = { mal_id: 24, type: 'anime', name: 'Sci-Fi',     url: 'https://myanimelist.net/anime/genre/24/Sci-Fi' };
const G_SPORT      = { mal_id: 30, type: 'anime', name: 'Sports',     url: 'https://myanimelist.net/anime/genre/30/Sports' };
const G_SHOUNEN    = { mal_id: 27, type: 'anime', name: 'Shounen',    url: 'https://myanimelist.net/anime/genre/27/Shounen' };
const G_SUPERNATURAL = { mal_id: 37, type: 'anime', name: 'Supernatural', url: 'https://myanimelist.net/anime/genre/37/Supernatural' };
const G_MYSTERY    = { mal_id: 7,  type: 'anime', name: 'Mystery',    url: 'https://myanimelist.net/anime/genre/7/Mystery' };
const G_PSYCHOLOGICAL = { mal_id: 40, type: 'anime', name: 'Psychological', url: 'https://myanimelist.net/anime/genre/40/Psychological' };

// ── Estudios reutilizables ───────────────────────────────────────────────────
const S_MAPPA      = { mal_id: 569,  type: 'anime', name: 'MAPPA',          url: 'https://myanimelist.net/anime/producer/569' };
const S_UFOTABLE   = { mal_id: 43,   type: 'anime', name: 'ufotable',       url: 'https://myanimelist.net/anime/producer/43' };
const S_WIT        = { mal_id: 858,  type: 'anime', name: 'Wit Studio',     url: 'https://myanimelist.net/anime/producer/858' };
const S_BONES      = { mal_id: 4,    type: 'anime', name: 'Bones',          url: 'https://myanimelist.net/anime/producer/4' };
const S_MADHOUSE   = { mal_id: 11,   type: 'anime', name: 'Madhouse',       url: 'https://myanimelist.net/anime/producer/11' };
const S_TOEI       = { mal_id: 28,   type: 'anime', name: 'Toei Animation', url: 'https://myanimelist.net/anime/producer/28' };
const S_PIERROT    = { mal_id: 1,    type: 'anime', name: 'Pierrot',        url: 'https://myanimelist.net/anime/producer/1' };
const S_TRIGGER    = { mal_id: 858,  type: 'anime', name: 'Trigger',        url: 'https://myanimelist.net/anime/producer/858' };

// ── Instancias de Anime (datos reales de MAL) ───────────────────────────────

const snk = new Anime({
  mal_id: 16498,
  title: 'Attack on Titan',
  synopsis: 'Siglos después de que una raza de gigantes humanoides llamados Titanes apareció, la humanidad sobrevive tras enormes murallas que los protegen del exterior.',
  episodes: 25,
  status: 'Finished Airing',
  score: 8.54,
  type: 'TV',
  genres: [G_ACTION, G_DRAMA, G_FANTASY, G_SHOUNEN],
  studios: [S_WIT],
  image_url: 'https://cdn.myanimelist.net/images/anime/10/47347.jpg',
  popularity: 1,
});

const demonSlayer = new Anime({
  mal_id: 38000,
  title: 'Demon Slayer: Kimetsu no Yaiba',
  synopsis: 'Un joven aprende a convertirse en cazador de demonios después de que su familia es asesinada y su hermana se transforma en uno.',
  episodes: 26,
  status: 'Finished Airing',
  score: 8.53,
  type: 'TV',
  genres: [G_ACTION, G_FANTASY, G_SHOUNEN],
  studios: [S_UFOTABLE],
  image_url: 'https://cdn.myanimelist.net/images/anime/1286/99889.jpg',
  popularity: 2,
});

const jujutsuKaisen = new Anime({
  mal_id: 40748,
  title: 'Jujutsu Kaisen',
  synopsis: 'Un estudiante ingiere un dedo maldito y se une a una escuela secreta de hechiceros para luchar contra maldiciones sobrenaturales.',
  episodes: 24,
  status: 'Finished Airing',
  score: 8.62,
  type: 'TV',
  genres: [G_ACTION, G_FANTASY, G_SHOUNEN, G_SUPERNATURAL],
  studios: [S_MAPPA],
  image_url: 'https://cdn.myanimelist.net/images/anime/1171/109222.jpg',
  popularity: 3,
});

const cowboyBebop = new Anime({
  mal_id: 1,
  title: 'Cowboy Bebop',
  synopsis: 'Un grupo de cazarrecompensas viaja por el espacio en su nave, la Bebop, en un futuro lejano.',
  episodes: 26,
  status: 'Finished Airing',
  score: 8.75,
  type: 'TV',
  genres: [G_ACTION, G_ADVENTURE, G_SCIFI, G_DRAMA],
  studios: [S_BONES],
  image_url: 'https://cdn.myanimelist.net/images/anime/4/19644.jpg',
  popularity: 39,
});

const hunterXHunter = new Anime({
  mal_id: 11061,
  title: 'Hunter x Hunter (2011)',
  synopsis: 'Gon Freecss descubre que su padre, al que creía muerto, es un Hunter de élite, y decide seguir sus pasos.',
  episodes: 148,
  status: 'Finished Airing',
  score: 9.04,
  type: 'TV',
  genres: [G_ACTION, G_ADVENTURE, G_FANTASY, G_SHOUNEN],
  studios: [S_MADHOUSE],
  image_url: 'https://cdn.myanimelist.net/images/anime/1337/99013.jpg',
  popularity: 5,
});

const dragonBallZ = new Anime({
  mal_id: 813,
  title: 'Dragon Ball Z',
  synopsis: 'Goku y sus amigos defienden la Tierra de una serie de villanos, incluyendo extraterrestres, androides y dioses.',
  episodes: 291,
  status: 'Finished Airing',
  score: 8.14,
  type: 'TV',
  genres: [G_ACTION, G_ADVENTURE, G_COMEDY, G_FANTASY, G_SHOUNEN],
  studios: [S_TOEI],
  image_url: 'https://cdn.myanimelist.net/images/anime/1277/80888.jpg',
  popularity: 7,
});

const naruto = new Anime({
  mal_id: 20,
  title: 'Naruto',
  synopsis: 'Naruto Uzumaki, un joven ninja que busca reconocimiento de sus compañeros y sueña con convertirse en Hokage.',
  episodes: 220,
  status: 'Finished Airing',
  score: 7.97,
  type: 'TV',
  genres: [G_ACTION, G_ADVENTURE, G_COMEDY, G_SHOUNEN],
  studios: [S_PIERROT],
  image_url: 'https://cdn.myanimelist.net/images/anime/13/17405.jpg',
  popularity: 8,
});

const haikyuu = new Anime({
  mal_id: 20583,
  title: 'Haikyuu!!',
  synopsis: 'Shoyo Hinata, un estudiante de secundaria de baja estatura, sueña con convertirse en un gran jugador de voleibol.',
  episodes: 25,
  status: 'Finished Airing',
  score: 8.43,
  type: 'TV',
  genres: [G_COMEDY, G_DRAMA, G_SPORT, G_SHOUNEN],
  studios: [S_MAPPA],
  image_url: 'https://cdn.myanimelist.net/images/anime/7/76014.jpg',
  popularity: 11,
});

const deathNote = new Anime({
  mal_id: 1535,
  title: 'Death Note',
  synopsis: 'Light Yagami encuentra un cuaderno sobrenatural que le da el poder de matar a cualquier persona cuyo nombre escriba en él.',
  episodes: 37,
  status: 'Finished Airing',
  score: 8.62,
  type: 'TV',
  genres: [G_MYSTERY, G_PSYCHOLOGICAL, G_SUPERNATURAL, G_DRAMA],
  studios: [S_MADHOUSE],
  image_url: 'https://cdn.myanimelist.net/images/anime/9/9453.jpg',
  popularity: 4,
});

const chainsaw = new Anime({
  mal_id: 44511,
  title: 'Chainsaw Man',
  synopsis: 'Denji, un joven cazador de demonios en deuda con la mafia yakuza, se fusiona con su perro demonio para sobrevivir.',
  episodes: 12,
  status: 'Finished Airing',
  score: 8.57,
  type: 'TV',
  genres: [G_ACTION, G_FANTASY, G_SHOUNEN],
  studios: [S_MAPPA],
  image_url: 'https://cdn.myanimelist.net/images/anime/1806/126216.jpg',
  popularity: 12,
});

const fullmetalAlchemist = new Anime({
  mal_id: 5114,
  title: 'Fullmetal Alchemist: Brotherhood',
  synopsis: 'Dos hermanos buscan la Piedra Filosofal para recuperar sus cuerpos perdidos tras un fallido ritual de alquimia.',
  episodes: 64,
  status: 'Finished Airing',
  score: 9.08,
  type: 'TV',
  genres: [G_ACTION, G_ADVENTURE, G_DRAMA, G_FANTASY, G_SHOUNEN],
  studios: [S_BONES],
  image_url: 'https://cdn.myanimelist.net/images/anime/1208/94745.jpg',
  popularity: 6,
});

const steinsGate = new Anime({
  mal_id: 9253,
  title: 'Steins;Gate',
  synopsis: 'Un científico aficionado descubre accidentalmente cómo enviar mensajes al pasado, desencadenando consecuencias impredecibles.',
  episodes: 24,
  status: 'Finished Airing',
  score: 9.07,
  type: 'TV',
  genres: [G_DRAMA, G_MYSTERY, G_SCIFI, G_PSYCHOLOGICAL],
  studios: [S_WIT],
  image_url: 'https://cdn.myanimelist.net/images/anime/5/73199.jpg',
  popularity: 18,
});


/* =============================================================================
   VALIDACIÓN DE TODAS LAS ETAPAS
   Cada bloque prueba una o varias funciones y muestra los resultados por consola.
   ============================================================================= */

console.log('\n' + '='.repeat(60));
console.log('  VALIDACIÓN DE LA PRÁCTICA 1 — GESTIÓN DE ANIME');
console.log('='.repeat(60));

// ── Etapa 1: Clase Anime ─────────────────────────────────────────────────────
console.log('\n▶ ETAPA 1 — Getter y Setter de Anime');
console.log('  Título de snk:', snk.title);
console.log('  Score de snk:', snk.score);

// Probamos el setter con validación
snk.score = 8.8;
console.log('  Score actualizado:', snk.score);

snk.score = 15; // Debería mostrar advertencia
snk.title = ''; // Debería mostrar advertencia

// ── Etapa 2: Clase AnimeList ─────────────────────────────────────────────────
console.log('\n▶ ETAPA 2 — AnimeList: addAnime, removeAnime, showList');

const miLista = new AnimeList();

miLista.addAnime(snk);
miLista.addAnime(demonSlayer);
miLista.addAnime(jujutsuKaisen);
miLista.addAnime(cowboyBebop);
miLista.addAnime(hunterXHunter);
miLista.addAnime(dragonBallZ);

miLista.showList();

// Casos válidos e inválidos de removeAnime
miLista.removeAnime(813);     // ✅ Dragon Ball Z — eliminado correctamente
miLista.removeAnime(9999);    // ⚠️ ID válido pero no existe en la lista
miLista.removeAnime(-5);      // ⚠️ ID negativo — inválido
miLista.removeAnime('813');   // ⚠️ String en lugar de número — inválido
miLista.removeAnime(0);       // ⚠️ Cero — inválido (los IDs de MAL empiezan en 1)

miLista.showList();

// ── Etapa 3: Funciones flecha ────────────────────────────────────────────────
console.log('\n▶ ETAPA 3 — addMultipleAnimes, getAnimesByScoreRange, sortAnimesByPopularity');

// addMultipleAnimes: llamada sin argumentos — debe advertir
miLista.addMultipleAnimes(); // ⚠️ Array vacío

// addMultipleAnimes: uso correcto
miLista.addMultipleAnimes(naruto, haikyuu, deathNote, chainsaw, fullmetalAlchemist, steinsGate);
console.log('  Después de addMultipleAnimes, total de anime:', miLista.animes.length);

// getAnimesByScoreRange: casos inválidos
miLista.getAnimesByScoreRange('8', 10);     // ⚠️ minScore no es número
miLista.getAnimesByScoreRange(9, 7);        // ⚠️ maxScore < minScore
miLista.getAnimesByScoreRange(-1, 10);      // ⚠️ minScore negativo

// getAnimesByScoreRange: caso válido
const topAnimes = miLista.getAnimesByScoreRange(9.0, 10.0);
console.log('  Anime con puntuación entre 9.0 y 10.0:');
topAnimes.forEach(a => console.log(`    - ${a.title} (${a.score})`));

// sortAnimesByPopularity: ordenamos y mostramos los 5 primeros
miLista.sortAnimesByPopularity();
console.log('  Top 5 más populares tras ordenar:');
miLista.animes.slice(0, 5).forEach((a, i) => console.log(`    ${i + 1}. ${a.title} (rank: ${a.popularity})`));

// ── Etapa 4: Función recursiva ───────────────────────────────────────────────
console.log('\n▶ ETAPA 4 — findAnimeById (recursiva)');

// Casos inválidos
findAnimeById({}, 40748);         // ⚠️ Primer argumento no es AnimeList
findAnimeById(miLista, 'abc');    // ⚠️ ID no es número
findAnimeById(miLista, -1);       // ⚠️ ID negativo

// Casos válidos
const encontrado = findAnimeById(miLista, 40748); // ✅ Jujutsu Kaisen
console.log('  Buscando ID 40748 (Jujutsu Kaisen):', encontrado ? encontrado.title : 'No encontrado');

const noEncontrado = findAnimeById(miLista, 99999); // ✅ No existe
console.log('  Buscando ID 99999 (inexistente):', noEncontrado ?? 'No encontrado');

// ── Etapa 5: reduce ──────────────────────────────────────────────────────────
console.log('\n▶ ETAPA 5 — getMostCommonGenre (reduce)');

getMostCommonGenre([]); // ⚠️ No es una AnimeList

const listaVacia = new AnimeList();
getMostCommonGenre(listaVacia); // ⚠️ Lista vacía

const generoMasComun = getMostCommonGenre(miLista); // ✅
console.log('  Género más común en la lista:', generoMasComun);

// ── Etapa 6: map y filter ────────────────────────────────────────────────────
console.log('\n▶ ETAPA 6 — getHighRatedAnimes (map + filter)');

getHighRatedAnimes('no-es-array', 9.0); // ⚠️ Primer argumento no es array
getHighRatedAnimes(miLista.animes, 11); // ⚠️ minScore fuera de rango
getHighRatedAnimes(miLista.animes, -1); // ⚠️ minScore negativo

const titulosAltoRating = getHighRatedAnimes(miLista.animes, 9.0); // ✅
console.log('  Anime con puntuación ≥ 9.0:', titulosAltoRating);

// ── Etapa 7: destructuring y spread ──────────────────────────────────────────
console.log('\n▶ ETAPA 7 — getAnimeInfo (destructuring + spread)');

getAnimeInfo({ title: 'Fake' }); // ⚠️ No es instancia de Anime

const infoJJK = getAnimeInfo(jujutsuKaisen); // ✅
console.log('  ¿El objeto devuelto tiene fullInfo?', infoJJK.fullInfo);

// ── Etapa 8: función avanzada ─────────────────────────────────────────────────
console.log('\n▶ ETAPA 8 — getAnimesByStudio (filter + map + reduce)');

getAnimesByStudio('no-array', 'MAPPA');   // ⚠️ Primer argumento no es array
getAnimesByStudio(miLista.animes, '  '); // ⚠️ Nombre de estudio vacío
getAnimesByStudio(miLista.animes, 123);  // ⚠️ Nombre de estudio no es string

const resultadoMappa = getAnimesByStudio(miLista.animes, 'MAPPA'); // ✅
console.log('  Resultados para el estudio MAPPA:', resultadoMappa);

const resultadoBones = getAnimesByStudio(miLista.animes, 'Bones'); // ✅
console.log('  Resultados para el estudio Bones:', resultadoBones);

const resultadoInexistente = getAnimesByStudio(miLista.animes, 'KyoAni'); // ✅ Sin resultados
console.log('  Resultados para un estudio sin anime:', resultadoInexistente);

console.log('\n' + '='.repeat(60));
console.log('  FIN DE LA VALIDACIÓN');
console.log('='.repeat(60) + '\n');
