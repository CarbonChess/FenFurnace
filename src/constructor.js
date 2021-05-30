import * as validation from 'validation.js';

class CustomPiece {

    constructor({template, validWhen}) {
        this.template = template;
        this.validWhen = validWhen;
    }

    validate(dx,dy) {
        switch (this.template) {

            default: this.validWhen(dx,dy); break;
        }
    }

}
