import {Suspense, lazy} from "react";
import type {ClassKey} from "keycloakify/login";
import type {KcContext} from "./KcContext";
import {useDownloadTerms} from "keycloakify/login";
import {useI18n} from "./i18n";
import DefaultPage from "keycloakify/login/DefaultPage";
import Template from "keycloakify/login/Template";
import Login from "./pages/Login.tsx";

const UserProfileFormFields = lazy(
    () => import("keycloakify/login/UserProfileFormFields")
);

const doMakeUserConfirmPassword = true;

export default function KcPage(props: { kcContext: KcContext }) {
    const {kcContext} = props;

    useDownloadTerms({
        kcContext,
        downloadTermsMarkdown: async ({currentLanguageTag}) => {
            let termsLanguageTag = currentLanguageTag;
            let termsFileName: string;

            switch (currentLanguageTag) {
                case "fr":
                    termsFileName = "fr.md";
                    break;
                case "es":
                    termsFileName = "es.md";
                    break;
                default:
                    termsFileName = "en.md";
                    termsLanguageTag = "en";
                    break;
            }

            const termsMarkdown = await fetch(
                `${import.meta.env.BASE_URL}terms/${termsFileName}`
            ).then(r => r.text());

            return {termsMarkdown, termsLanguageTag};
        }
    });

    const {i18n} = useI18n({kcContext});

    return (
        <Suspense>
            {(() => {
                switch (kcContext.pageId) {

                    case "login.ftl":
                        return (
                            <Login
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss
                            />
                        );
                    default:
                        return (
                            <DefaultPage
                                kcContext={kcContext}
                                i18n={i18n}
                                classes={classes}
                                Template={Template}
                                doUseDefaultCss
                                UserProfileFormFields={UserProfileFormFields}
                                doMakeUserConfirmPassword={doMakeUserConfirmPassword}
                            />
                        );
                }
            })()}
        </Suspense>
    );
}

const classes = {} satisfies { [key in ClassKey]?: string };
