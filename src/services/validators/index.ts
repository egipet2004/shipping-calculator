import { RequiredFieldsValidator, PostalCodeFormatValidator, StateCodeValidator, DimensionsValidator, WeightValidator } from "./validation-chain";

export function createAddressValidationChain() {
    const required = new RequiredFieldsValidator();
    const postal = new PostalCodeFormatValidator();
    const state = new StateCodeValidator();

    required.setNext(postal).setNext(state);

    return required;
}

export function createPackageValidationChain() {
    const dimensions = new DimensionsValidator();
    const weight = new WeightValidator();

    dimensions.setNext(weight);

    return dimensions;
}
