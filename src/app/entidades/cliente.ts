export class Cliente {
    constructor(
        public nombre = '',
        public celular = '',
        public direccion = ''
    ) { }

    get numero(): string {
        return this.celular;
    }

    set numero(numero: string) {
        this.celular = numero;
    }
}