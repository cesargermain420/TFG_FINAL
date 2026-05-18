import type { Evento } from './evento';

export type RootStackParamList = {
  Home: undefined;
  Login: undefined;
  DetalleEvento: { evento: Evento };
  CrearEvento: { evento?: Evento };
  Blog: undefined;
  Favoritos: undefined;
  Comer: undefined;
  Info: undefined;
};

//INFO DE NAVEGACION ENTRE PANTALLAS EN HOME,BLOG,LOGIN DETALLEEVENTO Y CREAREVENTO.

