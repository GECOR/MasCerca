import {Auxiliar} from './auxiliar';

export class Writer extends Auxiliar {

    isWriting: boolean;
    
    constructor(obj?: any) {
        super(obj);
        this.isWriting = obj && obj.isWriting || false;
    }
}