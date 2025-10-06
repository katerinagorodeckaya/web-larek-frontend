import { Component } from '../base/Component';
import { ensureElement } from '../../utils/utils';

export interface IOrderSuccess {
    total: number;
}

export class OrderSuccess extends Component<IOrderSuccess> {
    protected _totalElement: HTMLElement;
    protected _closeButton: HTMLButtonElement;

    constructor(container: HTMLElement, protected onClose?: () => void) {
        super(container);

        this._totalElement = ensureElement<HTMLElement>('.order-success__description', container);
        this._closeButton = ensureElement<HTMLButtonElement>('.order-success__close', container);

        if (this.onClose) {
            this._closeButton.addEventListener('click', this.onClose);
        }
    }

    set total(value: number) {
        this._totalElement.textContent = `Списано ${value} синапсов`;
    }
}