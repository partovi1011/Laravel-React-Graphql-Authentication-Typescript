import { gql } from "@apollo/client";


export const ME_QUERY = gql`
    query Me {
        me {
            id
            name
            email
            avatar
        }
    }
`;



export const LOGIN_MUTATION = gql`
    mutation Login($email: String!, $password: String!) {
        login(input: { email: $email, password: $password }) {
            token
            status
            user {
                name
                email
                avatar
            }
            errors
        }
    }
`;
export const REGISTER_MUTATION = gql`
    mutation Register(
        $name: String!
        $password: String!
        $email: String!
        $password_confirmation: String!
    ) {
        register(
            input: {
                name: $name
                email: $email
                password: $password
                password_confirmation: $password_confirmation
            }
        ) {
            token
            status
            user {
                name
                email
                avatar
            }
            errors
        }
    }
`;

export const UPDATE_USER_MUTATION = gql`
    mutation UpdateUser($name: String, $email: String) {
        updateUser(input: { name: $name, email: $email }) {
            status
            user {
                name
                email
                avatar
            }
            errors
        }
    }
`;

export const LOGOUT_MUTATION = gql`
    mutation Logout {
        logout {
            status
        }
    }
`;


export const VERIFY_EMAIL_MUTATION = gql`
    mutation VerifyEmail($email: String!, $token: String!) {
        verifyEmail(input: { email: $email, token: $token }) {
            token
            status
            user {
                name
                email
                avatar
            }
            errors
        }
    }
`;


export const AVATAR_MUTATION = gql`
    mutation File($file: Upload!) {
        uploadAvatar(file: $file) {
            user{
                name
                email
                avatar
            }
            status
        }
    }
`;

export const UPDATE_PASSWORD = gql`
    mutation UpdatePassword(
        $current_password: String!
        $password: String!
        $password_confirmation: String!
    ) {
        updatePassword(
            input: {
                current_password: $current_password
                password: $password
                password_confirmation: $password_confirmation
            }
        ) {
            status
            errors
        }
    }
`;
