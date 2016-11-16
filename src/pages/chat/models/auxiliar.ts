export class Auxiliar {
  DNIAuxiliar: string;
  NAuxiliar: string;
  ApAuxiliar: string;
  NumTelf1: string;
  NumTelf2: string;
  Movil: string;
  TipoAux: string;
  e_mail: string;
  NomCompleto: string;
  AreaPertenencia: string;
  clicked: boolean;

  constructor(obj?: any) {
    console.log("Auxiliar "+obj);
    this.DNIAuxiliar      = obj && obj.DNIAuxiliar      || undefined;
    this.NAuxiliar        = obj && obj.NAuxiliar        || undefined;
    this.ApAuxiliar       = obj && obj.ApAuxiliar       || undefined;
    this.NumTelf1         = obj && obj.NumTelf1         || undefined;
    this.NumTelf2         = obj && obj.NumTelf2         || undefined;
    this.Movil            = obj && obj.Movil            || undefined;
    this.TipoAux          = obj && obj.TipoAux          || undefined;
    this.e_mail           = obj && obj.e_mail           || undefined;
    this.NomCompleto      = obj && obj.NomCompleto      || undefined;
    this.AreaPertenencia  = obj && obj.AreaPertenencia  || undefined;
    this.clicked          = false;
  }
}