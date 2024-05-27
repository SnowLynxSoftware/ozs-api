export interface IRawEnv {
    APP_KEY: string;
    APP_BASE_API_URL: string;
    APP_BASE_FRONTEND_URL: string;
    NODE_ENV: string;
    LOG_LEVEL: string;
    DB_CONNECTION_STRING: string;
    JWT_SECRET: string;
    JWT_ACCESS_TOKEN_EXPIRY: string;
    JWT_VERIFICATION_TOKEN_EXPIRY: string;
    JWT_REFRESH_TOKEN_EXPIRY: string;
    AUTH_LOGIN_MAX_ATTEMPTS: string;
    AUTH_LOGIN_LOCKOUT_IN_SECONDS: string;
    CRYPTO_KEY_LENGTH: string;
    CRYPTO_SALT_SIZE: string;
    EMAIL_PROVIDER_API_KEY: string;
}

export class EnvProvider {
    public static LoadRawEnv(): IRawEnv {
        try {
            let errorMessage = "";

            const { env } = process;

            if (!env.APP_KEY) {
                errorMessage += " APP_KEY";
            }

            if (!env.APP_BASE_API_URL) {
                errorMessage += " APP_BASE_API_URL";
            }

            if (!env.APP_BASE_FRONTEND_URL) {
                errorMessage += " APP_BASE_FRONTEND_URL";
            }

            if (!env.NODE_ENV) {
                console.log(
                    "NODE_ENV was not provided so we will default to: [development]"
                );
            }

            if (!env.LOG_LEVEL) {
                console.log(
                    "LOG_LEVEL was not provided so we will default to: [warning]"
                );
            }

            if (!env.DB_CONNECTION_STRING) {
                errorMessage += " DB_CONNECTION_STRING";
            }

            if (!env.JWT_SECRET) {
                errorMessage += " JWT_SECRET";
            }

            if (!env.JWT_ACCESS_TOKEN_EXPIRY) {
                errorMessage += " JWT_ACCESS_TOKEN_EXPIRY";
            }

            if (!env.JWT_VERIFICATION_TOKEN_EXPIRY) {
                errorMessage += " JWT_VERIFICATION_TOKEN_EXPIRY";
            }

            if (!env.JWT_REFRESH_TOKEN_EXPIRY) {
                errorMessage += " JWT_REFRESH_TOKEN_EXPIRY";
            }

            if (!env.AUTH_LOGIN_MAX_ATTEMPTS) {
                errorMessage += " AUTH_LOGIN_MAX_ATTEMPTS";
            }

            if (!env.AUTH_LOGIN_LOCKOUT_IN_SECONDS) {
                errorMessage += " AUTH_LOGIN_LOCKOUT_IN_SECONDS";
            }

            if (!env.CRYPTO_KEY_LENGTH) {
                errorMessage += " CRYPTO_KEY_LENGTH";
            }

            if (!env.CRYPTO_SALT_SIZE) {
                errorMessage += " CRYPTO_SALT_SIZE";
            }

            if (!env.EMAIL_PROVIDER_API_KEY) {
                errorMessage += " EMAIL_PROVIDER_API_KEY";
            }

            if (errorMessage) {
                throw new Error(
                    `App Will Not Start. Required Environment Vars Missing: [${errorMessage.trimEnd()}]`
                );
            }

            return {
                APP_KEY: (env.APP_KEY as string).toString(),
                APP_BASE_API_URL: (env.APP_BASE_API_URL as string).toString(),
                APP_BASE_FRONTEND_URL: (
                    env.APP_BASE_FRONTEND_URL as string
                ).toString(),
                NODE_ENV: env.NODE_ENV?.toString() || "development",
                LOG_LEVEL: env.LOG_LEVEL?.toString() || "warning",
                DB_CONNECTION_STRING: (
                    env.DB_CONNECTION_STRING as string
                ).toString(),
                JWT_SECRET: (env.JWT_SECRET as string).toString(),
                JWT_ACCESS_TOKEN_EXPIRY: (
                    env.JWT_ACCESS_TOKEN_EXPIRY as string
                ).toString(),
                JWT_VERIFICATION_TOKEN_EXPIRY: (
                    env.JWT_VERIFICATION_TOKEN_EXPIRY as string
                ).toString(),
                JWT_REFRESH_TOKEN_EXPIRY: (
                    env.JWT_REFRESH_TOKEN_EXPIRY as string
                ).toString(),
                AUTH_LOGIN_MAX_ATTEMPTS: (
                    env.AUTH_LOGIN_MAX_ATTEMPTS as string
                ).toString(),
                AUTH_LOGIN_LOCKOUT_IN_SECONDS: (
                    env.AUTH_LOGIN_LOCKOUT_IN_SECONDS as string
                ).toString(),
                CRYPTO_KEY_LENGTH: (env.CRYPTO_KEY_LENGTH as string).toString(),
                CRYPTO_SALT_SIZE: (env.CRYPTO_SALT_SIZE as string).toString(),
                EMAIL_PROVIDER_API_KEY: (
                    env.EMAIL_PROVIDER_API_KEY as string
                ).toString(),
            };
        } catch (error: any) {
            console.error(error.message);
            process.exit(1);
        }
    }
}
