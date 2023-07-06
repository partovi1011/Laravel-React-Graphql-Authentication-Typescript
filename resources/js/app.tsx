import "./bootstrap";
import "../css/app.css";
import { Toaster } from "@/Components/ui/toaster";
import { createRoot } from "react-dom/client";
import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { createUploadLink } from "apollo-upload-client";
import {
    ApolloClient,
    createHttpLink,
    InMemoryCache,
    ApolloProvider,
} from "@apollo/client";

import { setContext } from "@apollo/client/link/context";
import { Provider } from "react-redux";
import { store } from "@/redux";

const httpLink = createUploadLink({
    uri: "/graphql",
});

const authLink = setContext((_, { headers }) => {
    const token = localStorage.getItem("token");
    return {
        headers: {
            ...headers,
            authorization: token ? `Bearer ${token}` : "",
        },
    };
});

export const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache: new InMemoryCache(),
});

// const appName =
    // window.document.getElementsByTagName("title")[0]?.innerText || "Laravel";

createInertiaApp({
    title: (title) => `${title}`,
    resolve: (name) =>
        resolvePageComponent(
            `./Pages/${name}.tsx`,
            import.meta.glob("./Pages/**/*.tsx")
        ),
    setup({ el, App, props }) {
        const root = createRoot(el);

        root.render(
            <Provider store={store}>
                <ApolloProvider client={client}>
                    <App {...props} />
                    <Toaster />
                </ApolloProvider>
            </Provider>
        );
    },
    progress: {
        color: "red",
        showSpinner: true,
    },
});
