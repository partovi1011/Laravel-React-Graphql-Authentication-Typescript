import { gql } from "@apollo/client";

export const FORGOT_PASSWORD = gql`
    mutation ForgotPassword($email: String!) {
        forgotPassword(input: { email: $email }) {
            status
            errors
        }
    }
`;

export const RESET_PASSWORD = gql`
    mutation ResetPassword(
        $token: String!
        $email: String!
        $password: String!
        $password_confirmation: String!
    ) {
        resetPassword(
            input: {
                email: $email
                token: $token
                password: $password
                password_confirmation: $password_confirmation
            }
        ) {
            status
            errors
        }
    }
`;
