export interface User {
  id: string;
  email: string;
  name: string;
  anonymous: boolean;
  bearer?: string;
}

export const ANONYMOUS_USER: User = {
  id: '',
  email: 'nomail',
  name: 'no user',
  anonymous: true,
  bearer: '',
};

export interface SecurityState {
  loaded: boolean;
  user: User | undefined;
}

export interface Stazione{
  codice: string;
  nome: string;
  latitudine: number;
  longitudine: number;
}

export interface Treno{
  id: number;
  codice: string;
  capienza: number;
}

export interface Viaggio {
  id: number;
  treno: Treno;
  stazionePartenza: Stazione;
  stazioneArrivo: Stazione;
  dataPartenza: string; // Formato: YYYY-MM-DD
  orarioPartenza: string;  // Formato: HH:mm
  disponibilitaPosti: number;
  prezzo: number;
  version: number;
}

// prenotazione.model.ts
export interface Prenotazione {
  viaggio: Viaggio;
  posti: number;  // Numero di posti prenotati
  biglietti?: Biglietto[];
  prezzo: number;
}

// biglietto.model.ts
export interface Biglietto {
  stazionePartenza: string;
  stazioneArrivo: string;
  dataViaggio: string; // Formato: YYYY-MM-DD
  orarioViaggio: string;  // Formato: HH:mm
  nomePasseggero: string;
  cognomePasseggero : string;
  tariffa: string;
  prezzo: number;
}
