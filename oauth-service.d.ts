import { Http, Headers } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { ValidationHandler } from './token-validation/validation-handler';
import { UrlHelperService } from './url-helper.service';
import { OAuthEvent } from './events';
import { OAuthStorage, LoginOptions, ParsedIdToken } from './types';
import { AuthConfig } from './auth.config';
/**
 * Service for logging in and logging out with
 * OIDC and OAuth2. Supports implicit flow and
 * password flow.
 */
export declare class OAuthService extends AuthConfig {
    private http;
    private config;
    private urlHelper;
    /**
     * The ValidationHandler used to validate received
     * id_tokens.
     */
    tokenValidationHandler: ValidationHandler;
    /**
     * Informs about events, like token_received or token_expires.
     * See the string enum EventType for a full list of events.
     */
    events: Observable<OAuthEvent>;
    /**
     * The received (passed around) state, when logging
     * in with implicit flow.
     */
    state?: string;
    private eventsSubject;
    private discoveryDocumentLoadedSubject;
    private silentRefreshPostMessageEventListener;
    private grantTypesSupported;
    private _storage;
    private accessTokenTimeoutSubscription;
    private idTokenTimeoutSubscription;
    private sessionCheckEventListener;
    private jwksUri;
    private sessionCheckTimer;
    private silentRefreshSubject;
    constructor(http: Http, storage: OAuthStorage, tokenValidationHandler: ValidationHandler, config: AuthConfig, urlHelper: UrlHelperService);
    /**
     * Use this method to configure the service
     * @param config the configuration
     */
    configure(config: AuthConfig): void;
    private configChanged();
    restartSessionChecksIfStillLoggedIn(): void;
    private restartRefreshTimerIfStillLoggedIn();
    private setupSessionCheck();
    /**
     *
     * @param params Additional parameter to pass
     */
    setupAutomaticSilentRefresh(params?: object): void;
    loadDiscoveryDocumentAndTryLogin(): Promise<object>;
    private debug(...args);
    private validateUrlFromDiscoveryDocument(url);
    private validateUrlForHttps(url);
    private validateUrlAgainstIssuer(url);
    private setupRefreshTimer();
    private setupExpirationTimers();
    private setupAccessTokenTimer();
    private setupIdTokenTimer();
    private clearAccessTokenTimer();
    private clearIdTokenTimer();
    private calcTimeout(storedAt, expiration);
    /**
     * Sets a custom storage used to store the received
     * tokens on client side. By default, the browser's
     * sessionStorage is used.
     *
     * @param storage
     */
    setStorage(storage: OAuthStorage): void;
    /**
     * Loads the discovery document to configure most
     * properties of this service. The url of the discovery
     * document is infered from the issuer's url according
     * to the OpenId Connect spec. To use another url you
     * can pass it to to optional parameter fullUrl.
     *
     * @param fullUrl
     */
    loadDiscoveryDocument(fullUrl?: string): Promise<object>;
    private loadJwks();
    private validateDiscoveryDocument(doc);
    /**
     * Uses password flow to exchange userName and password for an
     * access_token. After receiving the access_token, this method
     * uses it to query the userinfo endpoint in order to get information
     * about the user in question.
     *
     * When using this, make sure that the property oidc is set to false.
     * Otherwise stricter validations take happen that makes this operation
     * fail.
     *
     * @param userName
     * @param password
     * @param headers Optional additional http-headers.
     */
    fetchTokenUsingPasswordFlowAndLoadUserProfile(userName: string, password: string, headers?: Headers): Promise<object>;
    /**
     * Loads the user profile by accessing the user info endpoint defined by OpenId Connect.
     *
     * When using this with OAuth2 password flow, make sure that the property oidc is set to false.
     * Otherwise stricter validations take happen that makes this operation
     * fail.
     */
    loadUserProfile(): Promise<object>;
    /**
     * Uses password flow to exchange userName and password for an access_token.
     * @param userName
     * @param password
     * @param headers Optional additional http-headers.
     */
    fetchTokenUsingPasswordFlow(userName: string, password: string, headers?: Headers): Promise<object>;

    /**
     * Uses password flow to exchange userName and password for an access_token.
     * @param accessToken
     * @param grantTypeURL
     * @param headers Optional additional http-headers.
     */
    fetchTokenUsingFacebookFlow(accessToken: string, grantTypeURL: string, headers?: Headers): Promise<object>;
    /**
     * Refreshes the token using a refresh_token.
     * This does not work for implicit flow, b/c
     * there is no refresh_token in this flow.
     * A solution for this is provided by the
     * method silentRefresh.
     */
    refreshToken(): Promise<object>;
    private removeSilentRefreshEventListener();
    private setupSilentRefreshEventListener();
    /**
     * Performs a silent refresh for implicit flow.
     * Use this method to get a new tokens when/ before
     * the existing tokens expires.
     */
    silentRefresh(params?: object): Promise<OAuthEvent>;
    private canPerformSessionCheck();
    private setupSessionCheckEventListener();
    private handleSessionUnchanged();
    private handleSessionChange();
    private waitForSilentRefreshAfterSessionChange();
    private handleSessionError();
    private removeSessionCheckEventListener();
    private initSessionCheck();
    private startSessionCheckTimer();
    private stopSessionCheckTimer();
    private checkSession();
    private createLoginUrl(state?, loginHint?, customRedirectUri?, noPrompt?, params?);
    /**
     * Starts the implicit flow and redirects to user to
     * the auth servers login url.
     *
     * @param additionalState Optinal state that is passes around.
     *  You find this state in the property ``state`` after ``tryLogin`` logged in the user.
     * @param params Hash with additional parameter. If it is a string, it is used for the
     *               parameter loginHint (for the sake of compatibility with former versions)
     */
    initImplicitFlow(additionalState?: string, params?: string | object): void;
    private callOnTokenReceivedIfExists(options);
    private storeAccessTokenResponse(accessToken, refreshToken, expiresIn);
    /**
     * Checks whether there are tokens in the hash fragment
     * as a result of the implicit flow. These tokens are
     * parsed, validated and used to sign the user in to the
     * current client.
     *
     * @param options Optinal options.
     */
    tryLogin(options?: LoginOptions): Promise<void>;
    private validateNonceForAccessToken(accessToken, nonceInState);
    protected storeIdToken(idToken: ParsedIdToken): void;
    protected storeSessionState(sessionState: string): void;
    protected getSessionState(): string;
    private handleLoginError(options, parts);
    /**
     * @ignore
     */
    processIdToken(idToken: string, accessToken: string): Promise<ParsedIdToken>;
    /**
     * Returns the received claims about the user.
     */
    getIdentityClaims(): object;
    /**
     * Returns the current id_token.
     */
    getIdToken(): string;
    private padBase64(base64data);
    /**
     * Returns the current access_token.
     */
    getAccessToken(): string;
    /**
     * Returns the expiration date of the access_token
     * as milliseconds since 1970.
     */
    getAccessTokenExpiration(): number;
    private getAccessTokenStoredAt();
    private getIdTokenStoredAt();
    /**
     * Returns the expiration date of the id_token
     * as milliseconds since 1970.
     */
    getIdTokenExpiration(): number;
    /**
     * Checkes, whether there is a valid access_token.
    */
    hasValidAccessToken(): boolean;
    /**
     * Checkes, whether there is a valid refresh_token.
    */
    hasValidRefreshToken(): boolean;
    /**
     * Checkes, whether there is a valid id_token.
    */
    hasValidIdToken(): boolean;
    /**
     * Returns the auth-header that can be used
     * to transmit the access_token to a service
    */
    authorizationHeader(): string;
    /**
     * Removes all tokens and logs the user out.
     * If a logout url is configured, the user is
     * redirected to it.
     * @param noRedirectToLogoutUrl
     */
    logOut(noRedirectToLogoutUrl?: boolean): void;
    /**
     * @ignore
     */
    createAndSaveNonce(): Promise<string>;
    protected createNonce(): Promise<string>;
    private checkAtHash(params);
    private checkSignature(params);
}
