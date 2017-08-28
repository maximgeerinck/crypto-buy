export const ValidationType = {
    V_DOMAIN_INVALID: "V_DOMAIN_INVALID",
    V_LOGIN_COMBO_INCORRECT: "V_LOGIN_COMBO_INCORRECT",
    TIMEOUT: "TIMEOUT"
};

const ValidationMessage = {
    V_DOMAIN_INVALID: "It seems like you have entered an incorrect domain, `%s` is invalid",
    V_LOGIN_COMBO_INCORRECT: "You have entered an invalid email/password",
    TIMEOUT: "Timeout"
};

const validationRules = {
    required: {
        rule: new RegExp("[a-z]*.required"),
        message: "%s is required"
    },
    email: {
        rule: new RegExp("[a-z]*.email"),
        message: "%s is not a valid email"
    },
    email_inUse: {
        rule: new RegExp("email.inUse"),
        message: "%s is already in use"
    },
    min_length: {
        rule: new RegExp("[a-z]*.min"),
        message: "%s should be at least %s characters long"
    },
    max_length: {
        rule: new RegExp("[a-z]*.max"),
        message: "%s should be maximum %s characters long"
    },
    number: {
        rule: new RegExp("number.base"),
        message: "%s should be a number and is required"
    },
    date: {
        rule: new RegExp("date.base"),
        message: "%s should be a valid date and is required"
    },
    password_incorrect: {
        rule: new RegExp("string.password_incorrect"),
        message: "%s is incorrect"
    }
};

export default class ValidationHelper {
    static constructMessage(key, parameters = []) {
        if (parameters.length === 0) return ValidationMessage[key];
        for (let i = 0; i < parameters.length; i++) {
            return ValidationMessage[key].replace("%s", parameters[i]);
        }
    }

    /**   
   * 
   * @static
   * @param {any} validationObject 
   * example:
   * {
          "path": "email",
          "code": "any.required"
     }
   * @param {any} [parameters=[]] 
   * @returns 
   * @memberof ValidationHelper
   */
    static parse(validation, validationKey, parameters = []) {
        if (!validation || !validation[validationKey]) return;

        const validationObject = validation[validationKey];

        // start matching regex
        for (let key in validationRules) {
            if (validationObject.code.match(validationRules[key].rule)) {
                let message = validationRules[key].message;

                for (let i = 0; i < parameters.length; i++) {
                    message = message.replace("%s", parameters[i]);
                }
                return message;
            }
        }
    }
}
