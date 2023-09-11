import patterns from "../../utils/patterns"

export const validate = (values) => {
    let errors = {}

    if (!values.userId) {
        errors.userId = "Required!"
    } else if (!patterns.username.test(values.userId)) {
        errors.userId = "Not valid!"
    }

    if (!values.password) {
        errors.password = "Required!"
    } else if (values.password.length < 8) {
        errors.password = "Too short!"
    } else if (values.password.length > 20) {
        errors.password = "Too long!"
    }

    return errors;
}