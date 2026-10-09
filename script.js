const LARGA_GOOGLE_MAPS_CONFIG = {
    // INTERACTION-SAFE DEMO KEY SETUP
    //
    // Do NOT paste the key into this JavaScript file.
    // Put the raw Demo Key by itself inside maps-demo-key.txt.
    // This prevents a typo in the key from breaking the entire app.
    demoKey: "",

    demoKeyFile: "maps-demo-key.txt",

    // Google's DEMO_MAP_ID is intended for development/prototyping.
    mapId: "DEMO_MAP_ID",

    demoMode: true
};


window.addEventListener(
    "DOMContentLoaded",
    function () {

        // ==================================================
        // HELPERS
        // ==================================================

        function get(id) {
            return document.getElementById(id);
        }


        function show(element) {

            if (element) {
                element.classList.remove("hidden");
            }

        }


        function hide(element) {

            if (element) {
                element.classList.add("hidden");
            }

        }



        // ==================================================
        // MAIN SCREENS
        // ==================================================

        const onboardingScreen =
            get("onboardingScreen");

        const splashView =
            get("splashView");

        const introSlide1 =
            get("introSlide1");

        const introSlide2 =
            get("introSlide2");

        const introSlide3 =
            get("introSlide3");

        const roleScreen =
            get("roleScreen");

        const loadingScreen =
            get("loadingScreen");

        const authScreen =
            get("authScreen");

        const driverScreen =
            get("driverScreen");

        const mainApp =
            get("mainApp");



        // ==================================================
        // ONBOARDING
        // ==================================================

        const onboardingPages = [
            splashView,
            introSlide1,
            introSlide2,
            introSlide3
        ];


        const onboardingControls =
            get("onboardingControls");

        const onboardingHint =
            get("onboardingHint");

        const onboardingDots =
            document.querySelectorAll(
                ".onboarding-dot"
            );


        const onboardingHints = {

            1:
                "Click right to continue →",

            2:
                "← Click left or right →",

            3:
                "← Click left to go back"

        };


        let currentOnboardingIndex =
            0;

        let onboardingAnimating =
            false;

        let hintTimeout =
            null;



        // ==================================================
        // INITIAL ONBOARDING
        // ==================================================

        function initializeOnboarding() {

            onboardingPages.forEach(
                function (
                    page,
                    index
                ) {

                    if (!page) {
                        return;
                    }


                    page
                        .getAnimations()
                        .forEach(
                            function (
                                animation
                            ) {

                                animation.cancel();

                            }
                        );


                    page.style.transform =
                        "translate3d(0, 0, 0)";


                    page.style.zIndex =
                        "";


                    if (
                        index === 0
                    ) {

                        show(
                            page
                        );

                    }

                    else {

                        hide(
                            page
                        );

                    }

                }
            );


            currentOnboardingIndex =
                0;


            onboardingControls
                .classList
                .add(
                    "controls-hidden"
                );

        }



        // ==================================================
        // FIXED ONBOARDING CONTROLS
        // ==================================================

        function updateOnboardingControls(
            index
        ) {

            if (
                index === 0
            ) {

                onboardingControls
                    .classList
                    .add(
                        "controls-hidden"
                    );


                return;

            }


            onboardingControls
                .classList
                .remove(
                    "controls-hidden"
                );


            onboardingDots.forEach(
                function (
                    dot,
                    dotIndex
                ) {

                    dot.classList.toggle(

                        "active",

                        dotIndex ===
                        index - 1

                    );

                }
            );


            if (
                hintTimeout
            ) {

                clearTimeout(
                    hintTimeout
                );

            }


            onboardingHint
                .classList
                .add(
                    "hint-fade"
                );


            hintTimeout =
                setTimeout(
                    function () {

                        onboardingHint.textContent =
                            onboardingHints[
                                index
                            ] || "";


                        onboardingHint
                            .classList
                            .remove(
                                "hint-fade"
                            );

                    },
                    150
                );

        }



        // ==================================================
        // ONBOARDING ANIMATION
        // ==================================================

        async function changeOnboardingPage(
            newIndex,
            direction
        ) {

            if (
                onboardingAnimating
            ) {
                return;
            }


            if (
                newIndex < 0 ||
                newIndex >=
                onboardingPages.length
            ) {
                return;
            }


            if (
                newIndex ===
                currentOnboardingIndex
            ) {
                return;
            }


            const oldPage =
                onboardingPages[
                    currentOnboardingIndex
                ];


            const newPage =
                onboardingPages[
                    newIndex
                ];


            onboardingAnimating =
                true;


            oldPage
                .getAnimations()
                .forEach(
                    function (
                        animation
                    ) {

                        animation.cancel();

                    }
                );


            newPage
                .getAnimations()
                .forEach(
                    function (
                        animation
                    ) {

                        animation.cancel();

                    }
                );


            show(
                newPage
            );


            oldPage.style.zIndex =
                "2";


            newPage.style.zIndex =
                "3";


            const animationOptions = {

                duration:
                    440,

                easing:
                    "cubic-bezier(0.22, 1, 0.36, 1)",

                fill:
                    "forwards"

            };


            let oldAnimation;

            let newAnimation;



            // NEXT
            // Current page goes left.
            // New page enters from right.

            if (
                direction ===
                "next"
            ) {

                oldAnimation =
                    oldPage.animate(

                        [
                            {
                                transform:
                                    "translate3d(0%, 0, 0)"
                            },

                            {
                                transform:
                                    "translate3d(-100%, 0, 0)"
                            }
                        ],

                        animationOptions

                    );


                newAnimation =
                    newPage.animate(

                        [
                            {
                                transform:
                                    "translate3d(100%, 0, 0)"
                            },

                            {
                                transform:
                                    "translate3d(0%, 0, 0)"
                            }
                        ],

                        animationOptions

                    );

            }


            // BACK

            else {

                oldAnimation =
                    oldPage.animate(

                        [
                            {
                                transform:
                                    "translate3d(0%, 0, 0)"
                            },

                            {
                                transform:
                                    "translate3d(100%, 0, 0)"
                            }
                        ],

                        animationOptions

                    );


                newAnimation =
                    newPage.animate(

                        [
                            {
                                transform:
                                    "translate3d(-100%, 0, 0)"
                            },

                            {
                                transform:
                                    "translate3d(0%, 0, 0)"
                            }
                        ],

                        animationOptions

                    );

            }


            updateOnboardingControls(
                newIndex
            );


            await Promise.allSettled(
                [
                    oldAnimation.finished,
                    newAnimation.finished
                ]
            );


            hide(
                oldPage
            );


            oldAnimation.cancel();

            newAnimation.cancel();


            oldPage.style.transform =
                "translate3d(0, 0, 0)";


            newPage.style.transform =
                "translate3d(0, 0, 0)";


            oldPage.style.zIndex =
                "";


            newPage.style.zIndex =
                "";


            currentOnboardingIndex =
                newIndex;


            onboardingAnimating =
                false;

        }



        // ==================================================
        // CLICK LEFT / RIGHT
        // ==================================================

        onboardingScreen.addEventListener(
            "click",
            function (
                event
            ) {

                if (
                    event.target.closest(
                        "button"
                    )
                ) {
                    return;
                }


                if (
                    onboardingAnimating
                ) {
                    return;
                }


                const rectangle =
                    onboardingScreen
                        .getBoundingClientRect();


                const clickX =
                    event.clientX -
                    rectangle.left;


                const middle =
                    rectangle.width / 2;



                // RIGHT SIDE = NEXT

                if (
                    clickX >= middle
                ) {

                    if (
                        currentOnboardingIndex <
                        onboardingPages.length - 1
                    ) {

                        changeOnboardingPage(

                            currentOnboardingIndex + 1,

                            "next"

                        );

                    }


                    return;

                }



                // LEFT SIDE = BACK

                if (
                    currentOnboardingIndex > 0
                ) {

                    changeOnboardingPage(

                        currentOnboardingIndex - 1,

                        "back"

                    );

                }

            }
        );



        // ==================================================
        // KEYBOARD NAVIGATION
        // ==================================================

        document.addEventListener(
            "keydown",
            function (
                event
            ) {

                if (
                    !socialMockOverlay
                        .classList
                        .contains(
                            "hidden"
                        )
                ) {

                    if (
                        event.key ===
                        "Escape"
                    ) {

                        closeSocialMock();

                    }


                    return;

                }


                if (
                    onboardingScreen
                        .classList
                        .contains(
                            "hidden"
                        )
                ) {
                    return;
                }


                if (
                    onboardingAnimating
                ) {
                    return;
                }


                if (
                    event.key ===
                    "ArrowRight"
                ) {

                    if (
                        currentOnboardingIndex <
                        onboardingPages.length - 1
                    ) {

                        changeOnboardingPage(

                            currentOnboardingIndex + 1,

                            "next"

                        );

                    }

                }


                if (
                    event.key ===
                    "ArrowLeft"
                ) {

                    if (
                        currentOnboardingIndex > 0
                    ) {

                        changeOnboardingPage(

                            currentOnboardingIndex - 1,

                            "back"

                        );

                    }

                }

            }
        );



        // ==================================================
        // GET STARTED
        // ==================================================

        const getStartedButton =
            get("getStartedButton");


        getStartedButton.addEventListener(
            "click",
            function (
                event
            ) {

                event.stopPropagation();


                hide(
                    onboardingScreen
                );


                show(
                    roleScreen
                );

            }
        );



        // ==================================================
        // ROLE
        // ==================================================

        const commuterButton =
            get("commuterButton");

        const driverButton =
            get("driverButton");

        const backToIntroButton =
            get("backToIntroButton");


        let selectedRole =
            "commuter";


        commuterButton.addEventListener(
            "click",
            function () {

                selectedRole =
                    "commuter";


                beginPersonalization();

            }
        );


        driverButton.addEventListener(
            "click",
            function () {

                selectedRole =
                    "driver";


                beginPersonalization();

            }
        );


        backToIntroButton.addEventListener(
            "click",
            function () {

                hide(
                    roleScreen
                );


                show(
                    onboardingScreen
                );


                onboardingPages.forEach(
                    function (
                        page,
                        index
                    ) {

                        if (
                            index === 3
                        ) {

                            show(
                                page
                            );

                        }

                        else {

                            hide(
                                page
                            );

                        }

                    }
                );


                currentOnboardingIndex =
                    3;


                updateOnboardingControls(
                    3
                );

            }
        );



        // ==================================================
        // PERSONALIZING
        // ==================================================

        let personalizingTimeout =
            null;


        function beginPersonalization() {

            hide(
                roleScreen
            );


            show(
                loadingScreen
            );


            if (
                personalizingTimeout
            ) {

                clearTimeout(
                    personalizingTimeout
                );

            }


            personalizingTimeout =
                setTimeout(
                    function () {

                        hide(
                            loadingScreen
                        );


                        openAuthLanding();

                    },
                    1900
                );

        }



        // ==================================================
        // AUTH ELEMENTS
        // ==================================================

        const authLandingView =
            get("authLandingView");

        const authFormView =
            get("authFormView");


        const guestLandingButton =
            get("guestLandingButton");

        const createAccountLandingButton =
            get(
                "createAccountLandingButton"
            );

        const loginLandingButton =
            get("loginLandingButton");


        const authFormBackButton =
            get("authFormBackButton");

            authFormBackButton.addEventListener(
    "click",
    function () {

        openAuthLanding();

    }
);


        const authFormTitle =
            get("authFormTitle");

        const authFormSubtitle =
            get("authFormSubtitle");


        const contactTab =
            get("contactTab");

        const emailTab =
            get("emailTab");


        const signupNameSection =
            get("signupNameSection");

        const confirmPasswordSection =
            get("confirmPasswordSection");

        const forgotRow =
            get("forgotRow");


        const phoneFieldSection =
            get("phoneFieldSection");

        const emailFieldSection =
            get("emailFieldSection");


        const nameInput =
            get("nameInput");

        const phoneInput =
            get("phoneInput");

        const emailInput =
            get("emailInput");

        const passwordInput =
            get("passwordInput");

        const confirmPasswordInput =
            get("confirmPasswordInput");


        const authForm =
            get("authForm");

        const authMessage =
            get("authMessage");

        const authSubmitButton =
            get("authSubmitButton");

        const forgotPasswordButton =
            get("forgotPasswordButton");


        const passwordToggleButtons =
            document.querySelectorAll(
                ".password-toggle"
            );


        const socialLoginButtons =
            document.querySelectorAll(
                ".social-icon-button"
            );


        let authMode =
            "login";

        let credentialMethod =
            "phone";

        let isGuest =
            false;

        let currentUserName =
            "Guest";



        // ==================================================
        // INTERNATIONAL PHONE
        // ==================================================

        let phoneSelector =
            null;


        if (
            window.intlTelInput &&
            phoneInput
        ) {

            phoneSelector =
                window.intlTelInput(

                    phoneInput,

                    {
                        initialCountry:
                            "ph",

                        separateDialCode:
                            true,

                        countrySearch:
                            true,

                        nationalMode:
                            true
                    }

                );

        }



        // ==================================================
        // AUTH LANDING
        // ==================================================

        function openAuthLanding() {

            show(
                authScreen
            );


            show(
                authLandingView
            );


            hide(
                authFormView
            );


            closeSocialMock();


            authMessage.textContent =
                "";


            blurActiveInput();

        }



        function blurActiveInput() {

            if (
                document.activeElement &&
                typeof document
                    .activeElement
                    .blur ===
                    "function"
            ) {

                document
                    .activeElement
                    .blur();

            }

        }



        guestLandingButton
            .addEventListener(
                "click",
                function () {

                    isGuest =
                        true;


                    currentUserName =
                        "Guest";


                    finishAuthentication();

                }
            );



        createAccountLandingButton
            .addEventListener(
                "click",
                function () {

                    // TRUE SIGN UP MODE

                    openAuthForm(
                        "signup"
                    );

                }
            );



        loginLandingButton
            .addEventListener(
                "click",
                function () {

                    openAuthForm(
                        "login"
                    );

                }
            );



        // ==================================================
        // OPEN LOGIN / SIGN UP
        // ==================================================

       function openAuthForm(
    mode
) {

    authMode =
        mode;


    hide(
        authLandingView
    );


    show(
        authFormView
    );


    authMessage.textContent =
        "";


    // ----------------------------------------------
    // SET SCREEN MODE FIRST
    // ----------------------------------------------

    if (
        authMode ===
        "signup"
    ) {

        authFormView.classList.add(
            "signup-mode"
        );


        authFormTitle.textContent =
            "Sign Up";


        authFormSubtitle.textContent =
            "Create an account with your details";


        authSubmitButton.textContent =
            "Create Account";


        show(
            signupNameSection
        );


        show(
            confirmPasswordSection
        );


        hide(
            forgotRow
        );

    }

    else {

        authFormView.classList.remove(
            "signup-mode"
        );


        authFormTitle.textContent =
            "Login";


        authFormSubtitle.textContent =
            "Sign in with your account details";


        authSubmitButton.textContent =
            "Login";


        hide(
            signupNameSection
        );


        hide(
            confirmPasswordSection
        );


        show(
            forgotRow
        );

    }


    // ----------------------------------------------
    // RESET FORM AFTER MODE IS ALREADY DISPLAYED
    // ----------------------------------------------

    authForm.reset();


    setCredentialMethod(
        "phone"
    );


    if (
        phoneSelector
    ) {

        phoneSelector.setCountry(
            "ph"
        );

    }


    // ----------------------------------------------
    // RESET PASSWORD FIELDS SAFELY
    // ----------------------------------------------

    if (
        passwordInput
    ) {

        passwordInput.type =
            "password";


        passwordInput.setAttribute(

            "autocomplete",

            authMode === "signup"
                ? "new-password"
                : "current-password"

        );

    }


    if (
        confirmPasswordInput
    ) {

        confirmPasswordInput.type =
            "password";


        confirmPasswordInput.setAttribute(
            "autocomplete",
            "new-password"
        );

    }


    passwordToggleButtons.forEach(
        function (
            button
        ) {

            const openEye =
                button.querySelector(
                    ".eye-open-icon"
                );


            const closedEye =
                button.querySelector(
                    ".eye-closed-icon"
                );


            if (
                openEye
            ) {

                show(
                    openEye
                );

            }


            if (
                closedEye
            ) {

                hide(
                    closedEye
                );

            }


            button.setAttribute(
                "aria-label",
                "Show password"
            );

        }
    );


    authFormView.scrollTop =
        0;

};



        // ==================================================
        // CONTACT / EMAIL
        // ==================================================

        function setCredentialMethod(
            method
        ) {

            credentialMethod =
                method;


            authMessage.textContent =
                "";


            if (
                method ===
                "phone"
            ) {

                contactTab
                    .classList
                    .add(
                        "active-credential-tab"
                    );


                emailTab
                    .classList
                    .remove(
                        "active-credential-tab"
                    );


                show(
                    phoneFieldSection
                );


                hide(
                    emailFieldSection
                );

            }

            else {

                emailTab
                    .classList
                    .add(
                        "active-credential-tab"
                    );


                contactTab
                    .classList
                    .remove(
                        "active-credential-tab"
                    );


                show(
                    emailFieldSection
                );


                hide(
                    phoneFieldSection
                );

            }

        }



        contactTab.addEventListener(
            "click",
            function () {

                setCredentialMethod(
                    "phone"
                );

            }
        );


        emailTab.addEventListener(
            "click",
            function () {

                setCredentialMethod(
                    "email"
                );

            }
        );



        // ==================================================
        // PASSWORD VISIBILITY
        // ==================================================

        passwordToggleButtons.forEach(
            function (
                button
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        const targetId =
                            button.getAttribute(
                                "data-target"
                            );


                        const input =
                            get(
                                targetId
                            );


                        if (
                            !input
                        ) {
                            return;
                        }


                        const showingPassword =
                            input.type ===
                            "text";


                        input.type =
                            showingPassword
                                ? "password"
                                : "text";


                        const openEye =
                            button.querySelector(
                                ".eye-open-icon"
                            );


                        const closedEye =
                            button.querySelector(
                                ".eye-closed-icon"
                            );


                        if (
                            input.type ===
                            "text"
                        ) {

                            hide(
                                openEye
                            );


                            show(
                                closedEye
                            );


                            button.setAttribute(
                                "aria-label",
                                "Hide password"
                            );

                        }

                        else {

                            show(
                                openEye
                            );


                            hide(
                                closedEye
                            );


                            button.setAttribute(
                                "aria-label",
                                "Show password"
                            );

                        }

                    }
                );

            }
        );



        function resetPasswordVisibility() {

            passwordInput.type =
                "password";


            confirmPasswordInput.type =
                "password";


            passwordToggleButtons.forEach(
                function (
                    button
                ) {

                    const openEye =
                        button.querySelector(
                            ".eye-open-icon"
                        );


                    const closedEye =
                        button.querySelector(
                            ".eye-closed-icon"
                        );


                    show(
                        openEye
                    );


                    hide(
                        closedEye
                    );


                    button.setAttribute(
                        "aria-label",
                        "Show password"
                    );

                }
            );

        }



        // ==================================================
        // AUTH SUBMIT
        // ==================================================

        authForm.addEventListener(
            "submit",
            function (
                event
            ) {

                event.preventDefault();


                authMessage.textContent =
                    "";



                // ------------------------------------------
                // FULL NAME FOR SIGN UP
                // ------------------------------------------

                if (
                    authMode ===
                    "signup"
                ) {

                    const name =
                        nameInput
                            .value
                            .trim();


                    if (
                        name === ""
                    ) {

                        authMessage.textContent =
                            "Please enter your full name.";


                        return;

                    }


                    currentUserName =
                        name;

                }



                // ------------------------------------------
                // PHONE
                // ------------------------------------------

                if (
                    credentialMethod ===
                    "phone"
                ) {

                    const phone =
                        phoneInput
                            .value
                            .trim();


                    if (
                        phone === ""
                    ) {

                        authMessage.textContent =
                            "Please enter your contact number.";


                        return;

                    }


                    if (
                        authMode ===
                        "login"
                    ) {

                        currentUserName =
                            "User";

                    }

                }



                // ------------------------------------------
                // EMAIL
                // ------------------------------------------

                if (
                    credentialMethod ===
                    "email"
                ) {

                    const email =
                        emailInput
                            .value
                            .trim();


                    if (
                        email === ""
                    ) {

                        authMessage.textContent =
                            "Please enter your email address.";


                        return;

                    }


                    if (
                        !email.includes(
                            "@"
                        )
                    ) {

                        authMessage.textContent =
                            "Please enter a valid email address.";


                        return;

                    }


                    if (
                        authMode ===
                        "login"
                    ) {

                        currentUserName =
                            email;

                    }

                }



                // ------------------------------------------
                // PASSWORD
                // ------------------------------------------

                const password =
                    passwordInput
                        .value;


                if (
                    password.trim() ===
                    ""
                ) {

                    authMessage.textContent =
                        "Please enter your password.";


                    return;

                }



                // ------------------------------------------
                // SIGN UP PASSWORD RULES
                // ------------------------------------------

                if (
                    authMode ===
                    "signup"
                ) {

                    if (
                        password.length <
                        6
                    ) {

                        authMessage.textContent =
                            "Password must contain at least 6 characters.";


                        return;

                    }


                    const confirmedPassword =
                        confirmPasswordInput
                            .value;


                    if (
                        confirmedPassword.trim() ===
                        ""
                    ) {

                        authMessage.textContent =
                            "Please confirm your password.";


                        return;

                    }


                    if (
                        password !==
                        confirmedPassword
                    ) {

                        authMessage.textContent =
                            "Passwords do not match.";


                        return;

                    }

                }


                isGuest =
                    false;


                finishAuthentication();

            }
        );



        // ==================================================
        // FORGOT PASSWORD
        // ==================================================

        forgotPasswordButton
            .addEventListener(
                "click",
                function () {

                    alert(
                        "Password recovery is a prototype feature for now."
                    );

                }
            );



        // ==================================================
        // MOCK SOCIAL LOGIN
        // ==================================================

        const socialMockOverlay =
            get("socialMockOverlay");

        const mockCloseButton =
            get("mockCloseButton");

        const mockProviderIcon =
            get("mockProviderIcon");

        const mockProviderTitle =
            get("mockProviderTitle");

        const mockProviderSubtitle =
            get("mockProviderSubtitle");

        const googleMockPanel =
            get("googleMockPanel");

        const appleMockPanel =
            get("appleMockPanel");

        const mockError =
            get("mockError");


        const googleUseAnotherButton =
            get(
                "googleUseAnotherButton"
            );

        const googleOtherAccountSection =
            get(
                "googleOtherAccountSection"
            );

        const googleOtherEmail =
            get("googleOtherEmail");

        const googleOtherContinue =
            get("googleOtherContinue");


        const appleMockEmail =
            get("appleMockEmail");

        const appleMockContinue =
            get("appleMockContinue");

        const appleMockCancel =
            get("appleMockCancel");


        const mockGoogleAccounts =
            document.querySelectorAll(
                ".mock-account-option"
            );



        function openSocialMock(
            provider
        ) {

            mockError.textContent =
                "";


            googleOtherEmail.value =
                "";


            appleMockEmail.value =
                "";


            hide(
                googleOtherAccountSection
            );


            if (
                provider ===
                "Google"
            ) {

                mockProviderIcon.src =
                    "Assets/google-icon.svg";


                mockProviderTitle.textContent =
                    "Continue with Google";


                mockProviderSubtitle.textContent =
                    authMode === "signup"
                        ? "Choose a Google account to create your LARGA account."
                        : "Choose a Google account to continue to LARGA.";


                show(
                    googleMockPanel
                );


                hide(
                    appleMockPanel
                );

            }

            else {

                mockProviderIcon.src =
                    "Assets/apple-icon.svg";


                mockProviderTitle.textContent =
                    "Sign in with Apple";


                mockProviderSubtitle.textContent =
                    authMode === "signup"
                        ? "Use your Apple ID to create your LARGA account."
                        : "Use your Apple ID to continue to LARGA.";


                hide(
                    googleMockPanel
                );


                show(
                    appleMockPanel
                );

            }


            show(
                socialMockOverlay
            );


            socialMockOverlay.setAttribute(
                "aria-hidden",
                "false"
            );

        }



        function closeSocialMock() {

            if (
                !socialMockOverlay
            ) {
                return;
            }


            hide(
                socialMockOverlay
            );


            socialMockOverlay.setAttribute(
                "aria-hidden",
                "true"
            );


            mockError.textContent =
                "";


            blurActiveInput();

        }



        socialLoginButtons.forEach(
            function (
                button
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        const provider =
                            button.getAttribute(
                                "data-provider"
                            );


                        openSocialMock(
                            provider
                        );

                    }
                );

            }
        );



        mockCloseButton.addEventListener(
            "click",
            closeSocialMock
        );



        socialMockOverlay.addEventListener(
            "click",
            function (
                event
            ) {

                if (
                    event.target ===
                    socialMockOverlay
                ) {

                    closeSocialMock();

                }

            }
        );



        // ==================================================
        // GOOGLE MOCK ACCOUNTS
        // ==================================================

        mockGoogleAccounts.forEach(
            function (
                accountButton
            ) {

                accountButton.addEventListener(
                    "click",
                    function () {

                        const mockName =
                            accountButton.getAttribute(
                                "data-mock-name"
                            );


                        currentUserName =
                            mockName ||
                            "Google User";


                        isGuest =
                            false;


                        closeSocialMock();


                        finishAuthentication();

                    }
                );

            }
        );



        googleUseAnotherButton
            .addEventListener(
                "click",
                function () {

                    show(
                        googleOtherAccountSection
                    );


                    mockError.textContent =
                        "";


                    googleOtherEmail.focus();

                }
            );



        googleOtherContinue
            .addEventListener(
                "click",
                function () {

                    const email =
                        googleOtherEmail
                            .value
                            .trim();


                    if (
                        email === "" ||
                        !email.includes(
                            "@"
                        )
                    ) {

                        mockError.textContent =
                            "Enter a valid mock Google email.";


                        return;

                    }


                    currentUserName =
                        email;


                    isGuest =
                        false;


                    closeSocialMock();


                    finishAuthentication();

                }
            );



        // ==================================================
        // APPLE MOCK LOGIN
        // ==================================================

        appleMockContinue
            .addEventListener(
                "click",
                function () {

                    const email =
                        appleMockEmail
                            .value
                            .trim();


                    if (
                        email === "" ||
                        !email.includes(
                            "@"
                        )
                    ) {

                        mockError.textContent =
                            "Enter a valid mock Apple ID.";


                        return;

                    }


                    currentUserName =
                        email;


                    isGuest =
                        false;


                    closeSocialMock();


                    finishAuthentication();

                }
            );



        appleMockCancel
            .addEventListener(
                "click",
                closeSocialMock
            );



        // ==================================================
        // AUTH COMPLETE
        // ==================================================

        function finishAuthentication() {

            closeSocialMock();


            hide(
                authScreen
            );


            if (
                selectedRole ===
                "driver"
            ) {

                show(
                    driverScreen
                );


                return;

            }


            show(
                mainApp
            );


            updateProfileButton();


            openPage(
                "guide"
            );

        }



        // ==================================================
        // DRIVER
        // ==================================================

        const driverBackButton =
            get("driverBackButton");


        driverBackButton
            .addEventListener(
                "click",
                function () {

                    hide(
                        driverScreen
                    );


                    show(
                        roleScreen
                    );

                }
            );



        // ==================================================
        // MAIN NAVIGATION
        // ==================================================

        const pages = {

            guide:
                get("guidePage"),

            live:
                get("livePage"),

            trips:
                get("tripsPage"),

            saved:
                get("savedPage")

        };


        const pageTitles = {

            guide:
                "Route Guide",

            live:
                "Live Tracking",

            trips:
                "Trips",

            saved:
                "Saved"

        };


        const navButtons =
            document.querySelectorAll(
                ".nav-item"
            );


        const pageTitle =
            get("pageTitle");



        function openPage(
            pageName
        ) {

            if (
                !pages[
                    pageName
                ]
            ) {
                return;
            }


            Object.values(
                pages
            ).forEach(
                function (
                    page
                ) {

                    page
                        .classList
                        .remove(
                            "active-page"
                        );

                }
            );


            pages[
                pageName
            ].classList.add(
                "active-page"
            );


            navButtons.forEach(
                function (
                    button
                ) {

                    button
                        .classList
                        .remove(
                            "active-nav"
                        );

                }
            );


            const activeButton =
                document.querySelector(
                    '[data-page="' +
                    pageName +
                    '"]'
                );


            if (
                activeButton
            ) {

                activeButton
                    .classList
                    .add(
                        "active-nav"
                    );

            }


            pageTitle.textContent =
                pageTitles[
                    pageName
                ];


            mainApp.classList.toggle(
                "guide-mode",
                pageName === "guide"
            );


            const appContentElement =
                document.querySelector(
                    ".app-content"
                );


            if (
                pageName === "guide" &&
                appContentElement
            ) {

                appContentElement.scrollTop =
                    0;

            }


            if (
                pageName !== "guide" &&
                pages.guide
            ) {

                pages.guide.classList.remove(
                    "map-expanded"
                );

            }


            if (
                pageName === "live"
            ) {

                initializeLiveTrackingPage();

            }

        }



        navButtons.forEach(
            function (
                button
            ) {

                button.addEventListener(
                    "click",
                    function () {

                        openPage(

                            button.getAttribute(
                                "data-page"
                            )

                        );

                    }
                );

            }
        );



        // ==================================================
        // PROFILE
        // ==================================================

        const profileButton =
            get("profileButton");


        function updateProfileButton() {

            const displayName =
                isGuest
                    ? "Guest"
                    : (currentUserName || "User");

            profileButton.textContent =
                displayName
                    .trim()
                    .charAt(0)
                    .toUpperCase() || "G";

            profileButton.setAttribute(
                "aria-label",
                isGuest
                    ? "Guest profile"
                    : displayName + " profile"
            );

            profileButton.title =
                isGuest
                    ? "Guest"
                    : displayName;

        }



        profileButton.addEventListener(
            "click",
            function () {

                if (
                    isGuest
                ) {

                    alert(
                        "You are currently using LARGA as a guest."
                    );

                }

                else {

                    alert(
                        "Signed in as " +
                        currentUserName +
                        "."
                    );

                }

            }
        );



        // ==================================================
        // GUIDE 3.0 - MULTI-ROUTE BROWSING + POINT A TO B PLANNER
        // ==================================================

        const routeCarousel = get("routeCarousel");
        const routeSearchInput = get("routeSearchInput");
        const routeSearchResults = get("routeSearchResults");
        const routeSearchClear = get("routeSearchClear");
        const useLocationButton = get("useLocationButton");
        const guideLocationText = get("guideLocationText");
        const guideMessage = get("guideMessage");
        const guideRouteLayers = get("guideRouteLayers");
        const guideMapRouteName = get("guideMapRouteName");
        const guideMapRouteDot = get("guideMapRouteDot");
        const guideMapEyebrow = get("guideMapEyebrow");
        const guideMapSelectionHint = get("guideMapSelectionHint");
        const guideMapStops = get("guideMapStops");
        const guideMapJeeps = get("guideMapJeeps");
        const guideMapJourneyMarkers = get("guideMapJourneyMarkers");
        const guideUserMarker = get("guideUserMarker");
        const guideMapCanvas = get("guideMapCanvas");
        const guideGoogleMap = get("guideGoogleMap");
        const guideMapSetup = get("guideMapSetup");
        const guideMapWorld = get("guideMapWorld");
        const guideMapExpandButton = get("guideMapExpandButton");
        const guideMapExpandIcon = get("guideMapExpandIcon");
        const guideMapZoomIn = get("guideMapZoomIn");
        const guideMapZoomOut = get("guideMapZoomOut");
        const guidePageElement = get("guidePage");
        const guideSectionKicker = get("guideSectionKicker");
        const guideSectionTitle = get("guideSectionTitle");
        const guideTripSummary = get("guideTripSummary");
        const guideHeaderAction = get("guideHeaderAction");
        const browseRoutesModeButton = get("browseRoutesModeButton");
        const planTripModeButton = get("planTripModeButton");
        const browseRoutesPanel = get("browseRoutesPanel");
        const tripPlannerPanel = get("tripPlannerPanel");
        const tripFromInput = get("tripFromInput");
        const tripToInput = get("tripToInput");
        const findGuideTripButton = get("findGuideTripButton");
        const guidePlaceResults = get("guidePlaceResults");
        const routeDetailOverlay = get("routeDetailOverlay");
        const routeDetailGlass = get("routeDetailGlass");
        const routeDetailBackdrop = get("routeDetailBackdrop");
        const closeRouteDetailButton = get("closeRouteDetailButton");
        const routeDetailStatus = get("routeDetailStatus");
        const routeName = get("routeName");
        const routeDetailSummary = get("routeDetailSummary");
        const routeLandmarkChips = get("routeLandmarkChips");
        const routeDetailRoads = get("routeDetailRoads");
        const destinationInput = get("destinationInput");
        const startTripButton = get("startTripButton");
        const saveCurrentRouteButton = get("saveCurrentRouteButton");
        const saveMessage = get("saveMessage");

        // Route colors are prototype route-board reference colors.
        // Keep route data separate so real Google Maps polylines can
        // replace the schematic mapPath values later.

        const guideRouteCatalog = [

            {
                id: "route-1",
                downtown: true,
                name: "Route 1",
                short: "Marfori • Downtown • Bajada",
                primary: "#c92f32",
                secondary: "#f4f4f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Marfori Heights",
                    "San Pedro Church",
                    "Piapi",
                    "NCCC Uyanguren",
                    "GMall Bajada"
                ],
                roads: [
                    "Magallanes",
                    "Claveria",
                    "Jacinto",
                    "Quezon Boulevard",
                    "R. Magsaysay Avenue"
                ],
                summary:
                    "A central circulation route connecting Marfori with the downtown core and the Bajada commercial area.",
                mapPath:
                    "M 22 214 C 64 198, 79 171, 105 148 S 155 113, 195 121 S 263 102, 337 63",
                jeeps: [
                    [31, 64],
                    [66, 42]
                ]
            },

            {
                id: "route-2",
                downtown: true,
                name: "Route 2",
                short: "Ecoland • Uyanguren • San Pedro",
                primary: "#ef7d22",
                secondary: "#f7f4ef",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Ecoland",
                    "DCOTT",
                    "NCCC Uyanguren",
                    "San Pedro Church",
                    "Sandawa"
                ],
                roads: [
                    "Quimpo Boulevard",
                    "R. Magsaysay Avenue",
                    "Ponciano",
                    "San Pedro Street",
                    "Sandawa Road"
                ],
                summary:
                    "A downtown loop linking the Ecoland terminal area with Uyanguren, San Pedro, and Sandawa.",
                mapPath:
                    "M 26 226 C 68 213, 102 185, 122 148 C 140 112, 177 89, 217 95 C 268 102, 301 82, 334 55",
                jeeps: [
                    [36, 69],
                    [72, 35]
                ]
            },

            {
                id: "route-3",
                downtown: true,
                name: "Route 3",
                short: "Marfori • Uyanguren • Ilustre",
                primary: "#2d8a55",
                secondary: "#f4f4f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Marfori Heights",
                    "NCCC Uyanguren",
                    "San Pedro Church",
                    "Gaisano Ilustre",
                    "Mt. Apo Street"
                ],
                roads: [
                    "Magallanes",
                    "Claveria",
                    "R. Magsaysay Avenue",
                    "Ponciano",
                    "Ilustre Street"
                ],
                summary:
                    "A circulation loop serving Marfori, Uyanguren, the San Pedro core, Ilustre, and Mt. Apo Street.",
                mapPath:
                    "M 23 210 C 58 185, 78 140, 112 132 C 148 124, 163 161, 201 157 C 243 152, 268 101, 334 77",
                jeeps: [
                    [28, 57],
                    [70, 45]
                ]
            },

            {
                id: "route-4",
                downtown: true,
                name: "Route 4",
                short: "Downtown • Bajada • SPMC",
                primary: "#f7f7f5",
                secondary: "#cf3538",
                text: "#24272c",
                frequency: "Common",
                landmarks: [
                    "San Pedro Church",
                    "GMall Bajada",
                    "Abreeza Mall",
                    "SPMC",
                    "Assumption College"
                ],
                roads: [
                    "Claveria",
                    "J.P. Laurel Avenue",
                    "Cabaguio Avenue",
                    "Quezon Boulevard",
                    "San Pedro Street"
                ],
                summary:
                    "A major central route connecting downtown with Bajada, SPMC, Cabaguio, and the San Pedro area.",
                mapPath:
                    "M 20 227 C 69 215, 87 175, 130 164 S 195 143, 215 116 C 242 79, 284 67, 337 58",
                jeeps: [
                    [38, 68],
                    [74, 31]
                ]
            },

            {
                id: "route-5",
                downtown: true,
                name: "Route 5",
                short: "Bankerohan • Uyanguren • GMall",
                primary: "#168b8d",
                secondary: "#f4f4f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Bankerohan Public Market",
                    "San Pedro Church",
                    "NCCC Uyanguren",
                    "GMall Bajada",
                    "Sta. Ana area"
                ],
                roads: [
                    "Magallanes",
                    "Claveria",
                    "R. Magsaysay Avenue",
                    "Sta. Ana Avenue"
                ],
                summary:
                    "A Bankerohan-to-north-downtown circulation route through Claveria, Uyanguren, and the GMall area.",
                mapPath:
                    "M 18 221 C 57 206, 94 187, 115 154 C 139 116, 188 111, 219 125 C 259 143, 292 108, 339 69",
                jeeps: [
                    [33, 66],
                    [79, 41]
                ]
            },

            {
                id: "route-6",
                downtown: true,
                name: "Route 6",
                short: "Bankerohan • Boulevard • San Pedro",
                primary: "#f2f2ef",
                secondary: "#ee7c27",
                text: "#22262b",
                frequency: "Common",
                landmarks: [
                    "Bankerohan Public Market",
                    "Magsaysay Park",
                    "NCCC Uyanguren",
                    "San Pedro Church",
                    "Quezon Boulevard"
                ],
                roads: [
                    "Magallanes",
                    "Quezon Boulevard",
                    "R. Magsaysay Avenue",
                    "Ponciano",
                    "San Pedro Street"
                ],
                summary:
                    "A central loop from Bankerohan through the Boulevard and Magsaysay corridor before returning via San Pedro.",
                mapPath:
                    "M 23 224 C 79 216, 109 187, 127 151 S 169 96, 210 101 S 273 134, 337 87",
                jeeps: [
                    [39, 67],
                    [68, 41]
                ]
            },

            {
                id: "route-7",
                downtown: true,
                name: "Route 7",
                short: "Bankerohan • Agdao corridor",
                primary: "#d6bb3c",
                secondary: "#74777b",
                text: "#ffffff",
                frequency: "Limited",
                landmarks: [
                    "Bankerohan Public Market",
                    "Magsaysay Park",
                    "Agdao Public Market",
                    "Quezon Boulevard"
                ],
                roads: [
                    "Magallanes",
                    "Quezon Boulevard",
                    "L. Garcia Street",
                    "Agdao"
                ],
                summary:
                    "A circulation reference serving the Bankerohan, Boulevard, Magsaysay, and Agdao corridor.",
                mapPath:
                    "M 21 226 C 67 205, 91 169, 124 158 C 159 146, 169 110, 211 100 C 260 89, 287 109, 338 66",
                jeeps: [
                    [35, 62]
                ]
            },

            {
                id: "route-8",
                downtown: true,
                name: "Route 8",
                short: "City High • San Pedro • Ilustre",
                primary: "#70777f",
                secondary: "#f5f5f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Davao City National High School",
                    "Central Bank",
                    "San Pedro Church",
                    "Gaisano Ilustre",
                    "Davao Doctors Hospital"
                ],
                roads: [
                    "F. Torres Street",
                    "Jacinto Street",
                    "Ponciano",
                    "San Pedro Street",
                    "Quirino Avenue"
                ],
                summary:
                    "A compact downtown loop serving City High, San Pedro, Ilustre, Davao Doctors, and F. Torres.",
                mapPath:
                    "M 25 205 C 74 198, 91 150, 128 136 C 171 119, 190 145, 224 139 C 263 132, 285 91, 336 72",
                jeeps: [
                    [34, 58],
                    [73, 44]
                ]
            },

            {
                id: "route-9",
                downtown: true,
                name: "Route 9",
                short: "Bankerohan • Agdao • Downtown",
                primary: "#e4bd25",
                secondary: "#f6f5ee",
                text: "#26282c",
                frequency: "Limited",
                landmarks: [
                    "Bankerohan Public Market",
                    "Magsaysay Park",
                    "Agdao Public Market",
                    "GMall Bajada",
                    "Davao City National High School"
                ],
                roads: [
                    "Quezon Boulevard",
                    "L. Garcia Street",
                    "Sta. Ana Avenue",
                    "Jacinto Street",
                    "F. Torres Street"
                ],
                summary:
                    "A less common circulation reference linking Bankerohan with Agdao, Bajada, and the City High corridor.",
                mapPath:
                    "M 22 224 C 58 209, 84 171, 113 164 C 153 154, 184 120, 218 112 C 257 103, 291 123, 337 73",
                jeeps: [
                    [31, 64]
                ]
            },

            {
                id: "route-10",
                downtown: true,
                name: "Route 10",
                short: "Bankerohan • SPMC • Bajada",
                primary: "#2559ad",
                secondary: "#f4f4f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Bankerohan Public Market",
                    "NCCC Uyanguren",
                    "Magsaysay Park",
                    "SPMC",
                    "Abreeza Mall",
                    "GMall Bajada"
                ],
                roads: [
                    "Magallanes",
                    "Claveria",
                    "R. Magsaysay Avenue",
                    "Cabaguio Avenue",
                    "J.P. Laurel Avenue"
                ],
                summary:
                    "A major circulation route connecting Bankerohan and downtown with Cabaguio, SPMC, and the Bajada malls.",
                mapPath:
                    "M 19 225 C 69 211, 97 188, 119 153 C 145 111, 182 118, 213 106 C 257 89, 290 72, 340 55",
                jeeps: [
                    [37, 65],
                    [76, 32]
                ]
            },

            {
                id: "route-11",
                downtown: true,
                name: "Route 11",
                short: "Agdao • Bankerohan • Brokenshire",
                primary: "#855b3c",
                secondary: "#f5f4f0",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Agdao Public Market",
                    "Magsaysay Park",
                    "Bankerohan Public Market",
                    "Brokenshire Hospital",
                    "Davao City National High School"
                ],
                roads: [
                    "L. Garcia Street",
                    "Quezon Boulevard",
                    "San Pedro Street",
                    "Circumferential Road",
                    "F. Torres Street"
                ],
                summary:
                    "A wider central loop linking Agdao and Bankerohan with Brokenshire, Circumferential Road, and City High.",
                mapPath:
                    "M 21 207 C 51 178, 88 164, 112 126 C 139 83, 184 86, 215 118 C 242 146, 282 128, 337 77",
                jeeps: [
                    [29, 54],
                    [72, 47]
                ]
            },

            {
                id: "route-12",
                downtown: true,
                name: "Route 12",
                short: "Ecoland • Bankerohan • Magsaysay",
                primary: "#ef9f2d",
                secondary: "#f1c94b",
                text: "#292b2e",
                frequency: "Limited",
                landmarks: [
                    "DCOTT",
                    "Bankerohan Public Market",
                    "San Pedro Church",
                    "NCCC Uyanguren",
                    "Magsaysay Park",
                    "Felcris Centrale"
                ],
                roads: [
                    "Sandawa Road",
                    "McArthur Highway",
                    "Magallanes",
                    "Claveria",
                    "Quezon Boulevard",
                    "Quimpo Boulevard"
                ],
                summary:
                    "A circulation reference connecting Ecoland and DCOTT with Bankerohan, downtown, Magsaysay, and Quimpo Boulevard.",
                mapPath:
                    "M 18 231 C 57 220, 92 194, 118 158 C 147 118, 177 104, 210 111 C 258 123, 294 95, 339 59",
                jeeps: [
                    [36, 70]
                ]
            },

            {
                id: "route-13",
                downtown: true,
                name: "Route 13",
                short: "Marfori • Magsaysay • GMall",
                primary: "#c93d3d",
                secondary: "#3d8a58",
                text: "#ffffff",
                frequency: "Common",
                landmarks: [
                    "Marfori Heights",
                    "Gaisano Ilustre",
                    "San Pedro Church",
                    "Magsaysay Park",
                    "NCCC Uyanguren",
                    "GMall Bajada",
                    "Davao Doctors Hospital"
                ],
                roads: [
                    "Mt. Apo Street",
                    "Magallanes",
                    "Claveria",
                    "Quezon Boulevard",
                    "R. Magsaysay Avenue",
                    "Ponciano"
                ],
                summary:
                    "A broad central loop from Marfori through downtown, Magsaysay, GMall, Davao Doctors, and back toward Marfori.",
                mapPath:
                    "M 20 215 C 59 190, 80 152, 116 143 C 151 135, 169 91, 213 94 C 260 98, 286 136, 339 71",
                jeeps: [
                    [32, 61],
                    [69, 37]
                ]
            },

            // Additional high-use routes are searchable now.
            // Detailed card treatment can be added later without
            // changing the search or map-selection architecture.

            {
                id: "obrero",
                name: "Obrero",
                short: "Obrero • USeP • Downtown",
                primary: "#246c4a",
                secondary: "#f4f4f2",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["USeP Obrero", "Victoria Plaza", "GMall Bajada", "Sta. Ana"],
                roads: ["Obrero", "F. Torres", "J.P. Laurel Avenue", "Sta. Ana Avenue"],
                summary: "Serves the Obrero and USeP area with access toward Bajada and central Davao."
            },

            {
                id: "el-rio",
                name: "El Rio Vista",
                short: "El Rio • DMSF • Downtown",
                primary: "#2e6dad",
                secondary: "#dfc12f",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["El Rio", "Davao Medical School Foundation", "Victoria Plaza", "GMall Bajada", "San Pedro"],
                roads: ["Bajada", "J.P. Laurel Avenue", "Claveria", "San Pedro Street"],
                summary: "Connects El Rio and the DMSF area with Bajada and the downtown core."
            },

            {
                id: "matina-crossing",
                name: "Matina Crossing",
                short: "Matina Crossing • Bankerohan • Downtown",
                primary: "#e3bd31",
                secondary: "#2d66b0",
                text: "#25282c",
                frequency: "Common",
                landmarks: ["Matina Crossing", "Bankerohan Public Market", "San Pedro", "Roxas Avenue"],
                roads: ["McArthur Highway", "Quirino Avenue", "San Pedro Street", "Roxas Avenue"],
                summary: "A busy south-to-downtown route used by commuters from Matina Crossing."
            },

            {
                id: "matina-pangi",
                name: "Matina Pangi",
                short: "Matina Pangi • Matina • Roxas",
                primary: "#4f9b45",
                secondary: "#e7c94b",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Matina Pangi", "Matina Crossing", "Bankerohan", "Davao Doctors", "Roxas Avenue"],
                roads: ["Matina Pangi Road", "McArthur Highway", "Quirino Avenue", "Roxas Avenue"],
                summary: "Runs from Matina Pangi through Matina Crossing and into the downtown/Roxas corridor."
            },

            {
                id: "bago-aplaya",
                name: "Bago Aplaya",
                short: "Bago Aplaya • Ecoland • Downtown",
                primary: "#c7423f",
                secondary: "#2f8b56",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Bago Aplaya", "SM City Davao", "Ecoland", "Bankerohan", "Claveria"],
                roads: ["Bago Aplaya Road", "Quimpo Boulevard", "McArthur Highway", "Claveria"],
                summary: "Connects Bago Aplaya with SM City, Ecoland, and the downtown core."
            },

            {
                id: "ecoland-sm",
                name: "Ecoland - SM",
                short: "Ecoland • DCOTT • SM City",
                primary: "#e2bd2b",
                secondary: "#cb3f3f",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["DCOTT", "SM City Davao", "Ecoland", "Sandawa"],
                roads: ["Quimpo Boulevard", "Sandawa Road", "McArthur Highway"],
                summary: "A short south-city route serving the Ecoland terminal and SM City Davao area."
            },

            {
                id: "maa",
                name: "Ma-a",
                short: "Ma-a • Bankerohan • Downtown",
                primary: "#d8b62a",
                secondary: "#1d242b",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Ma-a", "NCCC Ma-a", "Bankerohan Public Market", "Magsaysay Park"],
                roads: ["Ma-a Road", "Quirino Avenue", "Magallanes", "R. Magsaysay Avenue"],
                summary: "Serves Ma-a and nearby communities with access to Bankerohan and central Davao."
            },

            {
                id: "buhangin-jp-laurel",
                name: "Buhangin via J.P. Laurel",
                short: "Buhangin • Bajada • Roxas",
                primary: "#d8b532",
                secondary: "#f3f1e9",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Buhangin", "Gaisano Citygate", "Abreeza Mall", "GMall Bajada", "Roxas Avenue"],
                roads: ["Buhangin Road", "J.P. Laurel Avenue", "Claveria", "Roxas Avenue"],
                summary: "A major Buhangin corridor route entering downtown through J.P. Laurel and Bajada."
            },

            {
                id: "buhangin-dacudao",
                name: "Buhangin via Dacudao",
                short: "Buhangin • Dacudao • Bankerohan",
                primary: "#d8b532",
                secondary: "#f3f1e9",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Buhangin", "NCCC Mall Buhangin", "Assumption College", "Agdao", "Bankerohan"],
                roads: ["Buhangin Road", "Dacudao Avenue", "Lapu-Lapu Street", "Magallanes"],
                summary: "Travels from Buhangin through Dacudao and Agdao toward the Bankerohan area."
            },

            {
                id: "sasa-jp-laurel",
                name: "Sasa via J.P. Laurel",
                short: "Sasa • Lanang • Bajada • Downtown",
                primary: "#2d62a3",
                secondary: "#f2f2ef",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Sasa", "Azuela Cove", "Damosa", "SM Lanang", "SPMC", "Abreeza Mall", "GMall Bajada"],
                roads: ["J.P. Laurel Avenue", "Bajada", "Claveria", "San Pedro Street"],
                summary: "A major north-city route through Lanang, SM Lanang, Bajada, and downtown."
            },

            {
                id: "sasa-r-castillo",
                name: "Sasa via R. Castillo",
                short: "Sasa • R. Castillo • Downtown",
                primary: "#2d62a3",
                secondary: "#f2f2ef",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Sasa", "Sasa Wharf", "Magsaysay Park", "San Pedro", "Downtown Davao"],
                roads: ["R. Castillo Street", "Quezon Boulevard", "R. Magsaysay Avenue", "San Pedro Street"],
                summary: "Connects Sasa and the wharf corridor with Magsaysay Park and central Davao."
            },

            {
                id: "sasa-cabaguio",
                name: "Sasa via Cabaguio",
                short: "Sasa • SM Lanang • Cabaguio",
                primary: "#2d62a3",
                secondary: "#f2f2ef",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Sasa", "SM Lanang", "Assumption College", "Agdao", "Magsaysay Park"],
                roads: ["J.P. Laurel Avenue", "Cabaguio Avenue", "L. Garcia Street", "R. Magsaysay Avenue"],
                summary: "A Sasa route entering the central area through Cabaguio and Agdao."
            },

            {
                id: "panacan-sm",
                name: "Panacan via SM",
                short: "Panacan • Lanang • SM City",
                primary: "#7a593c",
                secondary: "#f3f2ee",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Panacan", "SM Lanang", "Abreeza Mall", "Davao Doctors", "SM City Davao"],
                roads: ["J.P. Laurel Avenue", "Bajada", "Quirino Avenue", "McArthur Highway"],
                summary: "A long north-to-south corridor connecting Panacan with major malls and central Davao."
            },

            {
                id: "panacan-cabaguio",
                name: "Panacan via Cabaguio",
                short: "Panacan • Cabaguio • Roxas",
                primary: "#7a593c",
                secondary: "#f3f2ee",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Panacan", "SM Lanang", "SPMC", "Assumption College", "Magsaysay Park", "Roxas Avenue"],
                roads: ["J.P. Laurel Avenue", "Cabaguio Avenue", "Quezon Boulevard", "Roxas Avenue"],
                summary: "Connects Panacan to central Davao through Cabaguio, SPMC, and the Magsaysay/Roxas area."
            },

            {
                id: "acacia",
                name: "Acacia",
                short: "Acacia • Cabantian • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Acacia", "Gaisano Citygate", "Abreeza Mall", "Victoria Plaza", "GMall Bajada"],
                roads: ["Cabantian-Indangan Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "Serves Acacia and the Cabantian/Buhangin corridor toward Bajada and downtown."
            },

            {
                id: "cabantian",
                name: "Cabantian",
                short: "Cabantian • Citygate • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Cabantian", "Gaisano Citygate", "Abreeza Mall", "Victoria Plaza", "GMall Bajada"],
                roads: ["Cabantian Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "Connects Cabantian with Buhangin, Citygate, Bajada, and central Davao."
            },

            {
                id: "indangan",
                name: "Indangan",
                short: "Indangan • Cabantian • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Indangan", "Cabantian", "Gaisano Citygate", "Abreeza Mall", "GMall Bajada"],
                roads: ["Cabantian-Indangan Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "Serves Indangan and Cabantian with access toward Buhangin and the Bajada corridor."
            },

            {
                id: "tigatto",
                name: "Tigatto",
                short: "Tigatto • Citygate • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Tigatto", "DMMA", "Gaisano Citygate", "Abreeza Mall", "GMall Bajada"],
                roads: ["Tigatto Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "Connects Tigatto and the DMMA area with Citygate, Bajada, and downtown."
            },

            {
                id: "mandug",
                name: "Mandug",
                short: "Mandug • Tigatto • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Mandug", "Tigatto", "DMMA", "Gaisano Citygate", "Abreeza Mall"],
                roads: ["Mandug Road", "Tigatto Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "Serves Mandug through Tigatto and Buhangin toward the Bajada commercial corridor."
            },

            {
                id: "toril",
                name: "Toril - Roxas",
                short: "Toril • Matina • Roxas",
                primary: "#2c8a4c",
                secondary: "#f3f3ee",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Toril", "GMall Toril", "Ulas", "Matina Crossing", "Bankerohan", "Roxas Avenue"],
                roads: ["McArthur Highway", "Matina", "Quirino Avenue", "Roxas Avenue"],
                summary: "One of the main long-distance jeepney routes connecting Toril with central Davao."
            },

            {
                id: "ulas",
                name: "Ulas - Roxas",
                short: "Ulas • Matina • Bankerohan • Roxas",
                primary: "#285fa8",
                secondary: "#cb3838",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Ulas", "Matina", "Bankerohan Public Market", "Roxas Avenue"],
                roads: ["McArthur Highway", "Quirino Avenue", "Roxas Avenue"],
                summary: "Connects Ulas residents to the city center through Matina, Bankerohan, and Roxas Avenue."
            },

            {
                id: "catalunan-grande",
                name: "Catalunan Grande",
                short: "Catalunan Grande • Bangkal • Downtown",
                primary: "#d45d92",
                secondary: "#f7f1f4",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Catalunan Grande", "Bangkal", "Matina", "Bankerohan", "Claveria"],
                roads: ["Catalunan Grande Road", "McArthur Highway", "Quirino Avenue", "Claveria"],
                summary: "Serves Catalunan Grande through Bangkal and Matina toward central Davao."
            },

            {
                id: "camp-catitipan",
                name: "Camp Catitipan via J.P. Laurel",
                short: "Catitipan • Buhangin • Bajada",
                primary: "#d7b52e",
                secondary: "#f2f0e8",
                text: "#24272c",
                frequency: "Common",
                landmarks: ["Camp Catitipan", "Airport area", "Buhangin", "Abreeza Mall", "GMall Bajada"],
                roads: ["Catitipan Road", "Buhangin Road", "J.P. Laurel Avenue"],
                summary: "A north-city route from the Catitipan area through Buhangin and Bajada."
            },

            {
                id: "bunawan-buhangin",
                name: "Bunawan via Buhangin",
                short: "Bunawan • Airport • Buhangin • Roxas",
                primary: "#74499a",
                secondary: "#f3f0f6",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Bunawan", "Davao International Airport", "Buhangin", "USeP Obrero", "Roxas Avenue"],
                roads: ["Davao-Agusan Highway", "Buhangin Road", "Roxas Avenue"],
                summary: "A long north-city route connecting Bunawan with the airport/Buhangin corridor and downtown."
            },

            {
                id: "bunawan-sasa",
                name: "Bunawan via Sasa",
                short: "Bunawan • Panacan • Sasa • Downtown",
                primary: "#74499a",
                secondary: "#f3f0f6",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Bunawan", "Panacan", "Sasa", "Azuela Cove", "SM Lanang", "Magsaysay Park"],
                roads: ["Davao-Agusan Highway", "J.P. Laurel Avenue", "R. Castillo Street", "R. Magsaysay Avenue"],
                summary: "Connects Bunawan with Panacan, Sasa, Lanang, and the central Magsaysay corridor."
            },

            {
                id: "lasang-buhangin",
                name: "Lasang via Buhangin",
                short: "Lasang • Bunawan • Buhangin • Roxas",
                primary: "#8e9d38",
                secondary: "#e1bf35",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Lasang", "Bunawan", "Davao International Airport", "Buhangin", "USeP", "Roxas Avenue"],
                roads: ["Davao-Agusan Highway", "Buhangin Road", "Roxas Avenue"],
                summary: "A long northbound route from Lasang and Bunawan through Buhangin to downtown."
            },

            {
                id: "lasang-sasa",
                name: "Lasang via Sasa",
                short: "Lasang • Bunawan • Sasa • Downtown",
                primary: "#8e9d38",
                secondary: "#e1bf35",
                text: "#ffffff",
                frequency: "Common",
                landmarks: ["Lasang", "Bunawan", "Sasa", "SM Lanang", "Magsaysay Park"],
                roads: ["Davao-Agusan Highway", "J.P. Laurel Avenue", "R. Castillo Street", "R. Magsaysay Avenue"],
                summary: "A north-city route from Lasang through Bunawan, Sasa, Lanang, and central Davao."
            }

        ];




        // ==================================================
        // DOWNTOWN ROUTE 1-13 VERIFIED STREET SEQUENCES
        // ==================================================
        //
        // These corrections follow current Davao commuter-route references.
        // Google Maps is used as the base map. In Demo Key mode, LARGA
        // requests road-following geometry through Google's supported
        // Compute Routes web service only when a route is selected.
        //
        // IMPORTANT: The routes are reconstructed from published street
        // sequences. They are suitable for the prototype, but operational
        // changes and rare-route deviations should still be field-verified.

        const DOWNTOWN_GEOMETRY_VERSION =
            "2026-10-09-street-locked-v1";

        /*
         * Street-locked downtown route data.
         *
         * Accuracy strategy:
         * - Route cards no longer send Google a few broad landmarks.
         * - Each route is split into short ordered segments.
         * - Every segment is constrained through the published street order.
         * - The resulting road-following polyline is cached locally after the
         *   first successful calculation, so repeated selections do not keep
         *   re-computing the same geometry.
         *
         * Primary cross-checks for Routes 1-13:
         * - 2026 Metro Davao commuter route sequence
         * - OpenStreetMap Davao public-transport mapping notes
         * - 2026 CommuteTour route descriptions/maps
         * - Commute Davao used as a secondary visual/reference catalog
         *
         * These remain prototype transit geometries. Rare routes can still
         * change operationally, so field/LTFRB verification is still the final
         * authority before production use.
         */

        const verifiedDowntownRouteData = {

            "route-1": {
                short:
                    "Marfori Heights • Chinatown Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Marfori Heights",
                    "Bankerohan Public Market",
                    "Davao City Hall",
                    "Chinatown / Uyanguren",
                    "San Pedro Cathedral",
                    "Gaisano Ilustre"
                ],

                roads: [
                    "Lopez Jaena",
                    "General Luna",
                    "Pelayo",
                    "Magallanes / A. Pichon",
                    "C.M. Recto",
                    "Emilio Jacinto",
                    "Quezon Boulevard",
                    "R. Magsaysay",
                    "Chavez",
                    "Sobrecarey",
                    "Guzman",
                    "C. Bangoy",
                    "San Pedro",
                    "Ilustre"
                ],

                summary:
                    "Marfori Heights–Chinatown circulation loop through Bankerohan, Claveria, Quezon Boulevard, San Pedro, and Ilustre.",

                googleRouteSegments: [
                    [
                        "Marfori Heights, Davao City, Philippines",
                        "Lopez Jaena Street & General Luna Street, Davao City, Philippines",
                        "General Luna Street & Pelayo Street, Davao City, Philippines",
                        "Pelayo Street & A. Pichon Street, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines",
                        "C.M. Recto Avenue & Emilio Jacinto Street, Davao City, Philippines",
                        "Emilio Jacinto Street & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & R. Magsaysay Avenue, Davao City, Philippines"
                    ],
                    [
                        "Quezon Boulevard & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & Chavez Street, Davao City, Philippines",
                        "Chavez Street & Sobrecarey Street, Davao City, Philippines",
                        "Sobrecarey Street & Guzman Street, Davao City, Philippines",
                        "Guzman Street & C. Bangoy Street, Davao City, Philippines",
                        "C. Bangoy Street & San Pedro Street, Davao City, Philippines",
                        "San Pedro Street & Ilustre Street, Davao City, Philippines",
                        "Marfori Heights, Davao City, Philippines"
                    ]
                ]
            },

            "route-2": {
                short:
                    "Ecoland Terminal • Chinatown Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Davao City Overland Transport Terminal",
                    "Quezon Boulevard",
                    "Chinatown / Uyanguren",
                    "San Pedro Cathedral",
                    "Marfori",
                    "Generoso Bridge"
                ],

                roads: [
                    "Quezon Boulevard",
                    "R. Magsaysay",
                    "C. Bangoy",
                    "Bonifacio",
                    "Bolton",
                    "San Pedro",
                    "Marfori",
                    "Datu Bago Drive",
                    "Generoso Bridge"
                ],

                summary:
                    "Ecoland Terminal–Chinatown loop. Outbound uses Quezon Boulevard. The return uses Magsaysay, C. Bangoy, Bonifacio, Bolton, San Pedro, Marfori, and Datu Bago Drive.",

                googleRouteSegments: [
                    [
                        "Davao City Overland Transport Terminal, Davao City, Philippines",
                        "Quimpo Boulevard & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & R. Magsaysay Avenue, Davao City, Philippines"
                    ],
                    [
                        "Quezon Boulevard & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & C. Bangoy Street, Davao City, Philippines",
                        "C. Bangoy Street & Bonifacio Street, Davao City, Philippines",
                        "Bonifacio Street & Bolton Street, Davao City, Philippines",
                        "Bolton Street & San Pedro Street, Davao City, Philippines",
                        "San Pedro Street, Davao City, Philippines",
                        "Marfori Heights, Davao City, Philippines"
                    ],
                    [
                        "Marfori Heights, Davao City, Philippines",
                        "Datu Bago Drive, Davao City, Philippines",
                        "Governor Generoso Bridge, Davao City, Philippines",
                        "Davao City Overland Transport Terminal, Davao City, Philippines"
                    ]
                ]
            },

            "route-3": {
                short:
                    "Marfori Heights • Sta. Ana Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Marfori Heights",
                    "Davao City Hall",
                    "Ateneo de Davao University",
                    "Sta. Ana",
                    "Chinatown / Uyanguren",
                    "San Pedro Cathedral",
                    "Gaisano Ilustre"
                ],

                roads: [
                    "Lopez Jaena",
                    "General Luna",
                    "Pelayo",
                    "Magallanes",
                    "C.M. Recto",
                    "Dela Cruz",
                    "Emilio Jacinto",
                    "Aurora Quezon",
                    "J. Luna",
                    "Sales",
                    "R. Magsaysay",
                    "Chavez",
                    "Sobrecarey",
                    "Guzman",
                    "C. Bangoy",
                    "San Pedro",
                    "Ilustre"
                ],

                summary:
                    "Marfori Heights–Sta. Ana circulation loop using the downtown core, Chinatown, San Pedro, and Ilustre on the return.",

                googleRouteSegments: [
                    [
                        "Marfori Heights, Davao City, Philippines",
                        "Lopez Jaena Street & General Luna Street, Davao City, Philippines",
                        "General Luna Street & Pelayo Street, Davao City, Philippines",
                        "Pelayo Street & A. Pichon Street, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines",
                        "C.M. Recto Avenue & Dela Cruz Street, Davao City, Philippines",
                        "Dela Cruz Street & Emilio Jacinto Street, Davao City, Philippines",
                        "Emilio Jacinto Street & Aurora Quezon Street, Davao City, Philippines"
                    ],
                    [
                        "Emilio Jacinto Street & Aurora Quezon Street, Davao City, Philippines",
                        "Aurora Quezon Street & J. Luna Street, Davao City, Philippines",
                        "J. Luna Street & Sales Street, Davao City, Philippines",
                        "Sales Street & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & Chavez Street, Davao City, Philippines",
                        "Chavez Street & Sobrecarey Street, Davao City, Philippines",
                        "Sobrecarey Street & Guzman Street, Davao City, Philippines"
                    ],
                    [
                        "Sobrecarey Street & Guzman Street, Davao City, Philippines",
                        "Guzman Street & C. Bangoy Street, Davao City, Philippines",
                        "C. Bangoy Street & San Pedro Street, Davao City, Philippines",
                        "San Pedro Street & Ilustre Street, Davao City, Philippines",
                        "Marfori Heights, Davao City, Philippines"
                    ]
                ]
            },

            "route-4": {
                short:
                    "Claveria • SPMC Northbound Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Claveria",
                    "GMall Bajada",
                    "Abreeza",
                    "SPMC",
                    "Cabaguio",
                    "San Pedro Cathedral"
                ],

                roads: [
                    "C.M. Recto",
                    "J.P. Laurel Avenue",
                    "Cabaguio Road",
                    "Aurora Quezon",
                    "Quezon Boulevard",
                    "San Pedro"
                ],

                summary:
                    "Claveria–SPMC northbound loop through J.P. Laurel, Cabaguio, Quezon Boulevard, and San Pedro.",

                googleRouteSegments: [
                    [
                        "C.M. Recto Avenue & San Pedro Street, Davao City, Philippines",
                        "C.M. Recto Avenue & J.P. Laurel Avenue, Davao City, Philippines",
                        "Gaisano Mall of Davao, Davao City, Philippines",
                        "Ayala Malls Abreeza, Davao City, Philippines",
                        "Southern Philippines Medical Center, Davao City, Philippines",
                        "J.P. Laurel Avenue & Cabaguio Avenue, Davao City, Philippines"
                    ],
                    [
                        "J.P. Laurel Avenue & Cabaguio Avenue, Davao City, Philippines",
                        "Cabaguio Avenue & Aurora Quezon Street, Davao City, Philippines",
                        "Aurora Quezon Street & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & San Pedro Street, Davao City, Philippines",
                        "C.M. Recto Avenue & San Pedro Street, Davao City, Philippines"
                    ]
                ]
            },

            "route-5": {
                short:
                    "Bankerohan • Uyanguren • Agdao",

                frequency:
                    "Common",

                landmarks: [
                    "Bankerohan Public Market",
                    "Davao City Hall",
                    "Ateneo de Davao University",
                    "Chinatown / Uyanguren",
                    "Sta. Ana",
                    "Agdao Public Market",
                    "San Pedro Cathedral"
                ],

                roads: [
                    "A. Pichon / Magallanes",
                    "C.M. Recto",
                    "R. Magsaysay",
                    "Leon M. Guerrero",
                    "Sta. Ana",
                    "Guzman",
                    "Vinzons",
                    "Sobrecarey",
                    "Sales",
                    "Monteverde",
                    "F. Bangoy",
                    "W. Aquino",
                    "Leon Garcia",
                    "Quezon Boulevard",
                    "San Pedro"
                ],

                summary:
                    "Bankerohan–Agdao loop via Uyanguren. Route 5 and 5A follow the same general path. This card follows the Route 5/5A direction.",

                googleRouteSegments: [
                    [
                        "Bankerohan Public Market, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines",
                        "C.M. Recto Avenue & Roxas Avenue, Davao City, Philippines",
                        "Roxas Avenue & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & Leon M. Guerrero Street, Davao City, Philippines",
                        "Leon M. Guerrero Street & Sta. Ana Avenue, Davao City, Philippines",
                        "Sta. Ana Avenue & Guzman Street, Davao City, Philippines"
                    ],
                    [
                        "Sta. Ana Avenue & Guzman Street, Davao City, Philippines",
                        "Guzman Street & Vinzon Street, Davao City, Philippines",
                        "Vinzon Street & Sobrecarey Street, Davao City, Philippines",
                        "Sobrecarey Street & Sales Street, Davao City, Philippines",
                        "Sales Street & Monteverde Street, Davao City, Philippines",
                        "Monteverde Street & F. Bangoy Street, Davao City, Philippines",
                        "F. Bangoy Street & Sta. Ana Avenue, Davao City, Philippines"
                    ],
                    [
                        "F. Bangoy Street & Sta. Ana Avenue, Davao City, Philippines",
                        "Sta. Ana Avenue & W. Aquino Street, Davao City, Philippines",
                        "W. Aquino Street & Leon Garcia Street, Davao City, Philippines",
                        "Leon Garcia Street & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & San Pedro Street, Davao City, Philippines",
                        "Bankerohan Public Market, Davao City, Philippines"
                    ]
                ]
            },

            "route-6": {
                short:
                    "Bankerohan • Boulevard • Agdao",

                frequency:
                    "Common",

                landmarks: [
                    "Bankerohan Public Market",
                    "Trading Boulevard",
                    "Ramon Magsaysay Park",
                    "Agdao Public Market",
                    "Chinatown / Uyanguren",
                    "San Pedro Cathedral"
                ],

                roads: [
                    "A. Pichon / Magallanes",
                    "Trading Boulevard",
                    "Quezon Boulevard",
                    "Leon Garcia",
                    "6th Avenue",
                    "F. Bangoy",
                    "R. Magsaysay",
                    "C. Bangoy",
                    "Rizal",
                    "Bolton",
                    "San Pedro"
                ],

                summary:
                    "Bankerohan–Agdao loop via the Boulevard. The return uses Chinatown, C. Bangoy, Rizal, Bolton, and San Pedro.",

                googleRouteSegments: [
                    [
                        "Bankerohan Public Market, Davao City, Philippines",
                        "A. Pichon Street & Quimpo Boulevard, Davao City, Philippines",
                        "Trading Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Park, Davao City, Philippines",
                        "Leon Garcia Street & 6th Avenue, Davao City, Philippines",
                        "6th Avenue & F. Bangoy Street, Davao City, Philippines",
                        "Agdao Public Market, Davao City, Philippines"
                    ],
                    [
                        "Agdao Public Market, Davao City, Philippines",
                        "R. Magsaysay Park, Davao City, Philippines",
                        "R. Magsaysay Avenue & C. Bangoy Street, Davao City, Philippines",
                        "C. Bangoy Street & Rizal Street, Davao City, Philippines",
                        "Rizal Street & Bolton Street, Davao City, Philippines",
                        "Bolton Street & San Pedro Street, Davao City, Philippines",
                        "Bankerohan Public Market, Davao City, Philippines"
                    ]
                ]
            },

            "route-7": {
                short:
                    "Bankerohan • Dacudao • Agdao",

                frequency:
                    "Rare",

                landmarks: [
                    "Bankerohan Public Market",
                    "Boulevard",
                    "Dacudao Avenue",
                    "Agdao Public Market",
                    "Sta. Ana",
                    "San Pedro"
                ],

                roads: [
                    "Datu Bago",
                    "Magallanes",
                    "Boulevard",
                    "Dacudao Avenue",
                    "Agdao",
                    "Sta. Ana",
                    "R. Magsaysay",
                    "San Pedro"
                ],

                summary:
                    "Rare Bankerohan–Agdao circulation variant. It follows the Route 6 family of loops but uses Dacudao Avenue.",

                googleRouteSegments: [
                    [
                        "Bankerohan Public Market, Davao City, Philippines",
                        "A. Pichon Street, Davao City, Philippines",
                        "Trading Boulevard, Davao City, Philippines",
                        "Dacudao Avenue, Davao City, Philippines",
                        "Agdao Public Market, Davao City, Philippines"
                    ],
                    [
                        "Agdao Public Market, Davao City, Philippines",
                        "Sta. Ana Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue, Davao City, Philippines",
                        "San Pedro Street, Davao City, Philippines",
                        "Bankerohan Public Market, Davao City, Philippines"
                    ]
                ]
            },

            "route-8": {
                short:
                    "City High • San Pedro Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Davao City National High School",
                    "F. Torres",
                    "San Pedro Cathedral",
                    "Gaisano Ilustre",
                    "Davao Doctors Hospital",
                    "Quirino Avenue"
                ],

                roads: [
                    "F. Torres",
                    "Jacinto Extension",
                    "Ponciano",
                    "San Pedro",
                    "Ilustre",
                    "Gov. Duterte",
                    "Quirino",
                    "Tionko"
                ],

                summary:
                    "City High–San Pedro circulation loop through F. Torres, Jacinto Extension, Ilustre, Quirino Avenue, and Tionko.",

                googleRouteSegments: [
                    [
                        "Davao City National High School, Davao City, Philippines",
                        "F. Torres Street & Jacinto Extension, Davao City, Philippines",
                        "Jacinto Extension & Ponciano Street, Davao City, Philippines",
                        "Ponciano Street & San Pedro Street, Davao City, Philippines",
                        "San Pedro Street & Ilustre Street, Davao City, Philippines",
                        "Ilustre Street & Governor Duterte Street, Davao City, Philippines"
                    ],
                    [
                        "Ilustre Street & Governor Duterte Street, Davao City, Philippines",
                        "Governor Duterte Street & Quirino Avenue, Davao City, Philippines",
                        "Quirino Avenue & Tionko Avenue, Davao City, Philippines",
                        "Davao City National High School, Davao City, Philippines"
                    ]
                ]
            },

            "route-9": {
                short:
                    "Bankerohan • Lapu-Lapu • Agdao",

                frequency:
                    "Rare",

                landmarks: [
                    "Bankerohan Public Market",
                    "Trading Boulevard",
                    "Agdao Public Market",
                    "Sta. Ana",
                    "Bajada",
                    "City High"
                ],

                roads: [
                    "Datu Bago",
                    "Magallanes",
                    "Boulevard",
                    "Leon Garcia",
                    "Lapu-Lapu",
                    "Sta. Ana",
                    "J.P. Laurel",
                    "Quirino",
                    "Jacinto Extension",
                    "F. Torres",
                    "San Pedro Extension"
                ],

                summary:
                    "Rare Bankerohan–Agdao loop via Lapu-Lapu, Sta. Ana, Bajada, Quirino, and the City High corridor.",

                googleRouteSegments: [
                    [
                        "Bankerohan Public Market, Davao City, Philippines",
                        "Datu Bago Drive, Davao City, Philippines",
                        "A. Pichon Street, Davao City, Philippines",
                        "Trading Boulevard, Davao City, Philippines",
                        "Leon Garcia Street, Davao City, Philippines",
                        "Lapu-Lapu Street, Davao City, Philippines",
                        "Agdao Public Market, Davao City, Philippines"
                    ],
                    [
                        "Agdao Public Market, Davao City, Philippines",
                        "Sta. Ana Avenue & J.P. Laurel Avenue, Davao City, Philippines",
                        "J.P. Laurel Avenue & Quirino Avenue, Davao City, Philippines",
                        "Quirino Avenue & Jacinto Extension, Davao City, Philippines",
                        "Jacinto Extension & F. Torres Street, Davao City, Philippines",
                        "F. Torres Street & San Pedro Extension, Davao City, Philippines",
                        "Bankerohan Public Market, Davao City, Philippines"
                    ]
                ]
            },

            "route-10": {
                short:
                    "Claveria • SPMC Southbound Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Bankerohan Public Market",
                    "Chinatown / Uyanguren",
                    "Agdao",
                    "SPMC",
                    "GMall Bajada",
                    "San Pedro Cathedral"
                ],

                roads: [
                    "Magallanes",
                    "Uyanguren / R. Magsaysay",
                    "Quezon Boulevard",
                    "Leon Garcia",
                    "Cabaguio",
                    "J.P. Laurel",
                    "Ponciano",
                    "San Pedro",
                    "Claveria"
                ],

                summary:
                    "SPMC southbound loop through Uyanguren, Leon Garcia, Cabaguio, J.P. Laurel, Ponciano, San Pedro, Bankerohan, and Claveria.",

                googleRouteSegments: [
                    [
                        "C.M. Recto Avenue & A. Pichon Street, Davao City, Philippines",
                        "A. Pichon Street & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & Leon Garcia Street, Davao City, Philippines",
                        "Leon Garcia Street & Cabaguio Avenue, Davao City, Philippines",
                        "Cabaguio Avenue & J.P. Laurel Avenue, Davao City, Philippines",
                        "Southern Philippines Medical Center, Davao City, Philippines"
                    ],
                    [
                        "Southern Philippines Medical Center, Davao City, Philippines",
                        "J.P. Laurel Avenue & Ponciano Street, Davao City, Philippines",
                        "Ponciano Street & San Pedro Street, Davao City, Philippines",
                        "Bankerohan Public Market, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines"
                    ]
                ]
            },

            "route-11": {
                short:
                    "Agdao • Brokenshire Loop",

                frequency:
                    "Common",

                landmarks: [
                    "Agdao Public Market",
                    "San Pedro Cathedral",
                    "Bankerohan Public Market",
                    "Brokenshire College",
                    "Davao City National High School",
                    "Bajada"
                ],

                roads: [
                    "Leon Garcia",
                    "Boulevard",
                    "San Pedro",
                    "San Pedro Extension",
                    "Circumferential Road",
                    "F. Torres",
                    "J.P. Laurel",
                    "Loyola",
                    "Sobrecarey",
                    "Lapu-Lapu"
                ],

                summary:
                    "Agdao–Brokenshire circulation loop through the Boulevard, San Pedro, Circumferential Road, F. Torres, Bajada, Loyola, and Lapu-Lapu.",

                googleRouteSegments: [
                    [
                        "Agdao Public Market, Davao City, Philippines",
                        "Leon Garcia Street & Quezon Boulevard, Davao City, Philippines",
                        "Quezon Boulevard & San Pedro Street, Davao City, Philippines",
                        "San Pedro Street & San Pedro Extension, Davao City, Philippines",
                        "Brokenshire College, Davao City, Philippines",
                        "Circumferential Road, Davao City, Philippines"
                    ],
                    [
                        "Circumferential Road, Davao City, Philippines",
                        "F. Torres Street, Davao City, Philippines",
                        "J.P. Laurel Avenue & F. Torres Street, Davao City, Philippines",
                        "Loyola Street, Davao City, Philippines",
                        "Sobrecarey Street, Davao City, Philippines",
                        "Lapu-Lapu Street, Davao City, Philippines",
                        "Agdao Public Market, Davao City, Philippines"
                    ]
                ]
            },

            "route-12": {
                short:
                    "Ecoland • Chinatown via Sandawa",

                frequency:
                    "Rare",

                landmarks: [
                    "Ecoland",
                    "Sandawa",
                    "Davao City Hall",
                    "Chinatown / Uyanguren",
                    "Boulevard"
                ],

                roads: [
                    "Candelaria",
                    "Sandawa",
                    "McArthur Highway",
                    "Magallanes",
                    "Claveria",
                    "Uyanguren",
                    "J. Luna",
                    "Boulevard"
                ],

                summary:
                    "Rare Ecoland–Chinatown circulation loop through Sandawa, McArthur Highway, downtown, Uyanguren, J. Luna, and the Boulevard.",

                googleRouteSegments: [
                    [
                        "Davao City Overland Transport Terminal, Davao City, Philippines",
                        "Candelaria Street, Ecoland, Davao City, Philippines",
                        "Sandawa Road, Davao City, Philippines",
                        "McArthur Highway & A. Pichon Street, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines",
                        "C.M. Recto Avenue & R. Magsaysay Avenue, Davao City, Philippines"
                    ],
                    [
                        "C.M. Recto Avenue & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & J. Luna Street, Davao City, Philippines",
                        "J. Luna Street & R. Magsaysay Avenue, Davao City, Philippines",
                        "R. Magsaysay Avenue & Quezon Boulevard, Davao City, Philippines",
                        "Trading Boulevard, Davao City, Philippines",
                        "Davao City Overland Transport Terminal, Davao City, Philippines"
                    ]
                ]
            },

            "route-13": {
                short:
                    "SPC/GMall • RMC • City High Loop",

                frequency:
                    "Common",

                landmarks: [
                    "GMall Bajada",
                    "San Pedro College",
                    "Chinatown / Uyanguren",
                    "San Pedro Cathedral",
                    "Rizal Memorial Colleges",
                    "Davao City National High School"
                ],

                roads: [
                    "De Guzman",
                    "R. Magsaysay / Uyanguren",
                    "Ponciano",
                    "San Pedro",
                    "Ilustre",
                    "Gov. Duterte",
                    "Mt. Apo",
                    "Lopez Jaena",
                    "Circumferential",
                    "Mabini",
                    "F. Torres",
                    "Tionko",
                    "Arellano",
                    "General Luna",
                    "Quirino",
                    "Legazpi / Pelayo",
                    "Magallanes",
                    "Claveria",
                    "Jacinto",
                    "J. Luna",
                    "Chavez",
                    "Lapu-Lapu",
                    "Sobrecarey",
                    "Vinzon"
                ],

                summary:
                    "Long downtown circulation loop connecting SPC/GMall, Uyanguren, San Pedro, RMC, City High, Quirino, Claveria, Sta. Ana, and back to Bajada.",

                googleRouteSegments: [
                    [
                        "San Pedro College, Davao City, Philippines",
                        "De Guzman Street, Davao City, Philippines",
                        "R. Magsaysay Avenue, Davao City, Philippines",
                        "Ponciano Street, Davao City, Philippines",
                        "San Pedro Street, Davao City, Philippines",
                        "Ilustre Street, Davao City, Philippines",
                        "Governor Duterte Street, Davao City, Philippines",
                        "Mt. Apo Street, Davao City, Philippines"
                    ],
                    [
                        "Mt. Apo Street, Davao City, Philippines",
                        "Lopez Jaena Street, Davao City, Philippines",
                        "Rizal Memorial Colleges, Davao City, Philippines",
                        "Circumferential Road, Davao City, Philippines",
                        "Mabini Street, Davao City, Philippines",
                        "F. Torres Street, Davao City, Philippines",
                        "Davao City National High School, Davao City, Philippines",
                        "Tionko Avenue, Davao City, Philippines"
                    ],
                    [
                        "Tionko Avenue, Davao City, Philippines",
                        "Arellano Street, Davao City, Philippines",
                        "Mt. Apo Street & General Luna Street, Davao City, Philippines",
                        "General Luna Street & Quirino Avenue, Davao City, Philippines",
                        "Quirino Avenue & Legazpi Street, Davao City, Philippines",
                        "Legazpi Street & Pelayo Street, Davao City, Philippines",
                        "Pelayo Street & A. Pichon Street, Davao City, Philippines",
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines"
                    ],
                    [
                        "A. Pichon Street & C.M. Recto Avenue, Davao City, Philippines",
                        "C.M. Recto Avenue & Emilio Jacinto Street, Davao City, Philippines",
                        "Emilio Jacinto Street & J. Luna Street, Davao City, Philippines",
                        "J. Luna Street & Chavez Street, Davao City, Philippines",
                        "Chavez Street & Lapu-Lapu Street, Davao City, Philippines",
                        "Lapu-Lapu Street & Sobrecarey Street, Davao City, Philippines",
                        "Sobrecarey Street & Vinzon Street, Davao City, Philippines",
                        "Vinzon Street & De Guzman Street, Davao City, Philippines",
                        "San Pedro College, Davao City, Philippines"
                    ]
                ]
            }
        };

        Object.keys(verifiedDowntownRouteData).forEach(function (routeId) {
            const route = guideRouteCatalog.find(function (candidate) {
                return candidate.id === routeId;
            });

            if (route) {
                Object.assign(route, verifiedDowntownRouteData[routeId]);
                route.geometryStatus = "street-locked-2026";
            }
        });


        const downtownRoutes = guideRouteCatalog.filter(function (route) {
            return route.downtown === true;
        });

        const fallbackMapPaths = [
            "M 20 221 C 63 205, 85 169, 121 153 S 184 113, 220 120 S 286 101, 339 62",
            "M 24 226 C 72 218, 99 185, 126 151 S 177 94, 218 102 S 276 132, 337 72",
            "M 18 209 C 61 185, 91 151, 128 142 S 183 160, 216 139 S 281 91, 340 73"
        ];

        const downtownRouteColorLabels = {
            "route-1": "Red / White",
            "route-2": "Orange / White",
            "route-3": "Green / White",
            "route-4": "White / Red",
            "route-5": "Blue-green / White",
            "route-6": "White / Orange",
            "route-7": "Yellow / Gray",
            "route-8": "Gray / White",
            "route-9": "Yellow / White",
            "route-10": "Royal Blue / White",
            "route-11": "Brown / White",
            "route-12": "Orange-yellow / White",
            "route-13": "Red-green / White"
        };

        let selectedGuideRoute = null;
        let selectedGuideRouteIds = new Set();
        let currentGuideMode = "browse";
        let currentTripPlan = null;
        let focusedJourneyRouteId = null;

        function normalizeGuideText(value) {
            return String(value || "")
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, " ")
                .trim();
        }

        function getRouteById(routeId) {
            return guideRouteCatalog.find(function (route) {
                return route.id === routeId;
            }) || null;
        }

        function getRouteAccent(route) {
            const primary = route.primary.toLowerCase();
            if (
                primary === "#f7f7f5" ||
                primary === "#f2f2ef" ||
                primary === "#f3f3ee" ||
                primary === "#f4f4f2"
            ) {
                return route.secondary;
            }
            return route.primary;
        }

        function getRouteMapPath(route) {
            if (route.mapPath) {
                return route.mapPath;
            }
            const index = guideRouteCatalog.indexOf(route);
            return fallbackMapPaths[index % fallbackMapPaths.length];
        }

        function getRouteJeeps(route) {
            if (route.jeeps && route.jeeps.length) {
                return route.jeeps;
            }
            const index = guideRouteCatalog.indexOf(route);
            return [
                [32 + (index % 10), 60 - (index % 8)],
                [69 - (index % 7), 37 + (index % 6)]
            ];
        }

        function getDowntownRouteColorLabel(route) {
            return downtownRouteColorLabels[route.id] || "Route color";
        }

        function getReadableRouteText(route) {
            const hex = String(route.primary || "#000000")
                .replace("#", "")
                .trim();

            if (!/^[0-9a-f]{6}$/i.test(hex)) {
                return route.text || "#ffffff";
            }

            const red = parseInt(hex.slice(0, 2), 16);
            const green = parseInt(hex.slice(2, 4), 16);
            const blue = parseInt(hex.slice(4, 6), 16);

            // HSP perceived brightness. This keeps white text on genuinely
            // dark route colors, while switching yellow / white route boards
            // to dark text automatically.
            const brightness = Math.sqrt(
                0.299 * red * red +
                0.587 * green * green +
                0.114 * blue * blue
            );

            return brightness > 168
                ? "#20242a"
                : "#ffffff";
        }

        function isLightRouteCard(route) {
            return getReadableRouteText(route) !== "#ffffff";
        }

        function setCardTheme(card, route) {
            const readableText = getReadableRouteText(route);

            card.style.setProperty("--route-primary", route.primary);
            card.style.setProperty("--route-secondary", route.secondary);
            card.style.setProperty("--route-text", readableText);
            card.style.setProperty("--route-accent", getRouteAccent(route));
            card.classList.toggle("light-route-card", readableText !== "#ffffff");
        }

        function buildRouteCardContent(route, index) {
            return `
                <button
                    class="route-card-select-area"
                    type="button"
                    data-route-select="${route.id}"
                    aria-label="Toggle ${route.name} on the map"
                >
                    <span class="route-card-number">
                        DOWNTOWN ${String(index + 1).padStart(2, "0")}
                    </span>
                    <h3>${route.name}</h3>
                    <p class="route-card-identity">${route.short}</p>
                    <span class="route-card-color-label">
                        <i class="primary-swatch"></i>
                        <i class="secondary-swatch"></i>
                        ${getDowntownRouteColorLabel(route)}
                    </span>
                </button>
                <button
                    class="route-card-more"
                    type="button"
                    data-route-more="${route.id}"
                    aria-label="Learn more about ${route.name}"
                >
                    Learn More
                </button>
            `;
        }

        function renderDowntownRouteCards() {
            currentTripPlan = null;
            focusedJourneyRouteId = null;
            routeCarousel.classList.remove("journey-carousel");
            routeCarousel.innerHTML = "";

            downtownRoutes.forEach(function (route, index) {
                const card = document.createElement("article");
                card.className = "guide-route-card";
                card.setAttribute("data-route-id", route.id);
                setCardTheme(card, route);
                card.innerHTML = buildRouteCardContent(route, index);

                const selectArea = card.querySelector("[data-route-select]");
                const learnMoreButton = card.querySelector("[data-route-more]");

                selectArea.addEventListener("click", function (event) {
                    event.stopPropagation();
                    toggleGuideRoute(route.id, true);
                });

                learnMoreButton.addEventListener("click", function (event) {
                    event.preventDefault();
                    event.stopPropagation();
                    ensureGuideRouteSelected(route.id, false);
                    openRouteDetail(route.id, card);
                });

                routeCarousel.appendChild(card);
            });

            syncGuideCards();
        }

        function renderJourneyCards(plan) {
            routeCarousel.classList.add("journey-carousel");
            routeCarousel.innerHTML = "";

            plan.legs.forEach(function (leg, index) {
                const route = leg.route;
                const card = document.createElement("article");
                card.className = "guide-route-card journey-route-card selected-route-card";
                card.setAttribute("data-route-id", route.id);
                setCardTheme(card, route);

                const rideLabel = index === 0
                    ? "FIRST RIDE"
                    : (index === plan.legs.length - 1 ? "FINAL RIDE" : "TRANSFER RIDE");

                card.innerHTML = `
                    <button
                        class="route-card-select-area journey-card-select-area"
                        type="button"
                        aria-label="Focus ${route.name} on the trip map"
                    >
                        <span class="journey-step-badge">RIDE ${index + 1}</span>
                        <span class="journey-ride-label">${rideLabel}</span>
                        <h3>${route.name}</h3>
                        <div class="journey-leg-copy">
                            <span><b>Board</b>${leg.board}</span>
                            <span class="journey-leg-arrow">↓</span>
                            <span><b>Get off</b>${leg.alight}</span>
                        </div>
                    </button>
                    <button
                        class="route-card-more"
                        type="button"
                        aria-label="Learn more about ${route.name}"
                    >
                        Learn More
                    </button>
                `;

                card.querySelector(".journey-card-select-area")
                    .addEventListener("click", function (event) {
                        event.stopPropagation();
                        focusJourneyLeg(route.id);
                    });

                card.querySelector(".route-card-more")
                    .addEventListener("click", function (event) {
                        event.preventDefault();
                        event.stopPropagation();
                        selectedGuideRoute = route;
                        openRouteDetail(route.id, card);
                    });

                routeCarousel.appendChild(card);
            });

            if (
                plan.legs.length === 1 &&
                plan.alternativeDirectRoutes &&
                plan.alternativeDirectRoutes.length
            ) {
                plan.alternativeDirectRoutes
                    .forEach(function (route, alternativeIndex) {

                        const card =
                            document.createElement("article");

                        card.className =
                            "guide-route-card journey-route-card journey-alternative-card";

                        card.setAttribute(
                            "data-route-id",
                            route.id
                        );

                        setCardTheme(
                            card,
                            route
                        );

                        card.innerHTML = `
                            <button
                                class="route-card-select-area journey-card-select-area"
                                type="button"
                                aria-label="Use ${route.name} for this trip"
                            >
                                <span class="journey-step-badge">
                                    OPTION ${alternativeIndex + 2}
                                </span>
                                <span class="journey-ride-label">
                                    ALSO DIRECT
                                </span>
                                <h3>${route.name}</h3>
                                <div class="journey-leg-copy">
                                    <span>
                                        <b>Board</b>
                                        ${plan.start}
                                    </span>
                                    <span class="journey-leg-arrow">↓</span>
                                    <span>
                                        <b>Get off</b>
                                        ${plan.end}
                                    </span>
                                </div>
                            </button>

                            <button
                                class="route-card-more"
                                type="button"
                                aria-label="Learn more about ${route.name}"
                            >
                                Learn More
                            </button>
                        `;

                        card.querySelector(
                            ".journey-card-select-area"
                        ).addEventListener(
                            "click",
                            function (event) {
                                event.stopPropagation();

                                const previousPrimary =
                                    plan.legs[0].route;

                                plan.legs[0].route =
                                    route;

                                plan.alternativeDirectRoutes =
                                    [
                                        previousPrimary
                                    ].concat(
                                        plan.alternativeDirectRoutes
                                            .filter(function (candidate) {
                                                return candidate.id !== route.id;
                                            })
                                    );

                                selectedGuideRouteIds =
                                    new Set([
                                        route.id
                                    ]);

                                selectedGuideRoute =
                                    route;

                                routeName.textContent =
                                    route.name;

                                renderJourneyCards(
                                    plan
                                );

                                renderGuideMapRoutes();
                                updateGuideHeaderAction();

                                guideMessage.textContent =
                                    route.name +
                                    " selected. Other direct options remain available in the carousel.";
                            }
                        );

                        card.querySelector(
                            ".route-card-more"
                        ).addEventListener(
                            "click",
                            function (event) {
                                event.preventDefault();
                                event.stopPropagation();

                                selectedGuideRoute =
                                    route;

                                openRouteDetail(
                                    route.id,
                                    card
                                );
                            }
                        );

                        routeCarousel.appendChild(
                            card
                        );
                    });
            }

            focusJourneyLeg(null);
        }

        function syncGuideCards() {
            document.querySelectorAll(".guide-route-card").forEach(function (card) {
                const routeId = card.getAttribute("data-route-id");
                card.classList.toggle(
                    "selected-route-card",
                    selectedGuideRouteIds.has(routeId)
                );
            });
            updateGuideHeaderAction();
        }

        function ensureGuideRouteSelected(routeId, centerCard) {
            const route = getRouteById(routeId);
            if (!route) return;

            selectedGuideRouteIds.add(routeId);
            selectedGuideRoute = route;
            destinationInput.value = route.short;
            routeName.textContent = route.name;
            saveCurrentRouteButton.textContent = "☆ Save Route";
            saveMessage.textContent = "";

            syncGuideCards();
            renderGuideMapRoutes();

            if (centerCard) {
                const card = document.querySelector(`.guide-route-card[data-route-id="${routeId}"]`);
                if (card) {
                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });
                }
            }
        }

        function toggleGuideRoute(routeId, centerCard) {
            if (currentGuideMode === "plan" && currentTripPlan) {
                focusJourneyLeg(routeId);
                return;
            }

            const route = getRouteById(routeId);
            if (!route) return;

            if (selectedGuideRouteIds.has(routeId)) {
                selectedGuideRouteIds.delete(routeId);
                if (selectedGuideRoute && selectedGuideRoute.id === routeId) {
                    const remainingIds = Array.from(selectedGuideRouteIds);
                    selectedGuideRoute = remainingIds.length
                        ? getRouteById(remainingIds[remainingIds.length - 1])
                        : null;
                }
            }
            else {
                selectedGuideRouteIds.add(routeId);
                selectedGuideRoute = route;
            }

            if (selectedGuideRoute) {
                destinationInput.value = selectedGuideRoute.short;
                routeName.textContent = selectedGuideRoute.name;
            }
            else {
                destinationInput.value = "";
                routeName.textContent = "Select a route";
            }

            syncGuideCards();
            renderGuideMapRoutes();

            if (centerCard && selectedGuideRouteIds.has(routeId)) {
                const card = document.querySelector(`.guide-route-card[data-route-id="${routeId}"]`);
                if (card) {
                    card.scrollIntoView({
                        behavior: "smooth",
                        block: "nearest",
                        inline: "center"
                    });
                }
            }
        }

        function clearGuideRoutes() {
            selectedGuideRouteIds.clear();
            selectedGuideRoute = null;
            focusedJourneyRouteId = null;
            destinationInput.value = "";
            routeName.textContent = "Select a route";
            syncGuideCards();
            renderGuideMapRoutes();
        }

        function updateGuideHeaderAction() {
            if (currentGuideMode === "plan" && currentTripPlan) {
                guideHeaderAction.textContent = "Exit Plan";
                guideHeaderAction.disabled = false;
                return;
            }

            guideHeaderAction.textContent = "Deselect All";
            guideHeaderAction.disabled = selectedGuideRouteIds.size === 0;
        }


        // ==================================================
        // GOOGLE MAPS DEMO KEY + COMPUTE ROUTES WEB SERVICE
        // ==================================================

        const DAVAO_MAP_CENTER = {
            lat: 7.0736,
            lng: 125.6127
        };

        let googleGuideMap = null;
        let GooglePolyline = null;
        let GoogleAdvancedMarkerElement = null;
        let GoogleLatLngBounds = null;

        let googleUserMarker = null;
        let googleMapRenderGeneration = 0;

        const googleRoutePathCache = new Map();
        const googleRoutePathPromiseCache = new Map();

        let googleRoutePolylines = [];
        let googleRouteMarkers = [];

        async function loadGoogleMapsDemoKey() {
            if (hasGoogleMapsDemoKey()) {
                return;
            }

            try {
                const response =
                    await fetch(
                        LARGA_GOOGLE_MAPS_CONFIG.demoKeyFile,
                        {
                            cache: "no-store"
                        }
                    );

                if (!response.ok) {
                    return;
                }

                const key =
                    (await response.text()).trim();

                if (
                    key.length > 12 &&
                    !key.includes("PASTE_") &&
                    !key.includes("YOUR_")
                ) {
                    LARGA_GOOGLE_MAPS_CONFIG.demoKey =
                        key;
                }
            }
            catch (error) {
                // The rest of LARGA must remain fully usable even when
                // the key file is missing or Live Server is not running.
                console.warn(
                    "Maps Demo Key file was not loaded:",
                    error
                );
            }
        }

        function hasGoogleMapsDemoKey() {
            const key =
                LARGA_GOOGLE_MAPS_CONFIG.demoKey || "";

            return (
                key.length > 12 &&
                !key.includes("PASTE_") &&
                !key.includes("YOUR_")
            );
        }

        function loadGoogleMapsScript() {
            if (
                window.google &&
                window.google.maps &&
                window.google.maps.importLibrary
            ) {
                return Promise.resolve();
            }

            return new Promise(function (resolve, reject) {
                const existing = document.querySelector(
                    'script[data-larga-google-maps="true"]'
                );

                if (existing) {
                    existing.addEventListener("load", resolve, { once: true });
                    existing.addEventListener("error", reject, { once: true });
                    return;
                }

                const scriptElement = document.createElement("script");
                scriptElement.dataset.largaGoogleMaps = "true";
                scriptElement.async = true;
                scriptElement.defer = true;

                const parameters = new URLSearchParams({
                    key: LARGA_GOOGLE_MAPS_CONFIG.demoKey,
                    v: "weekly",
                    libraries: "marker",
                    language: "en",
                    region: "PH"
                });

                scriptElement.src =
                    "https://maps.googleapis.com/maps/api/js?" +
                    parameters.toString();

                scriptElement.addEventListener("load", resolve, { once: true });
                scriptElement.addEventListener("error", reject, { once: true });

                document.head.appendChild(scriptElement);
            });
        }

        async function initializeGoogleGuideMap() {
            if (!guideGoogleMap) {
                return;
            }

            await loadGoogleMapsDemoKey();

            if (!hasGoogleMapsDemoKey()) {
                show(guideMapSetup);

                guideMapSetup.querySelector("strong").textContent =
                    "Google Maps Demo Key";

                guideMapSetup.querySelector("span").textContent =
                    "Paste your no-billing Maps Demo Key into maps-demo-key.txt. The rest of LARGA stays fully usable even without the key.";

                return;
            }

            try {
                await loadGoogleMapsScript();

                const [
                    mapsLibrary,
                    markerLibrary,
                    coreLibrary
                ] = await Promise.all([
                    google.maps.importLibrary("maps"),
                    google.maps.importLibrary("marker"),
                    google.maps.importLibrary("core")
                ]);

                GooglePolyline =
                    mapsLibrary.Polyline;

                GoogleAdvancedMarkerElement =
                    markerLibrary.AdvancedMarkerElement;

                GoogleLatLngBounds =
                    coreLibrary.LatLngBounds;

                googleGuideMap =
                    new mapsLibrary.Map(
                        guideGoogleMap,
                        {
                            center: DAVAO_MAP_CENTER,
                            zoom: 13,
                            mapId:
                                LARGA_GOOGLE_MAPS_CONFIG.mapId ||
                                "DEMO_MAP_ID",

                            disableDefaultUI: true,
                            mapTypeControl: false,
                            fullscreenControl: false,
                            streetViewControl: false,
                            zoomControl: false,

                            gestureHandling: "greedy",
                            clickableIcons: true
                        }
                    );

                guideMapCanvas.classList.add(
                    "google-map-ready"
                );

                hide(guideMapWorld);
                hide(guideMapSetup);
                show(guideGoogleMap);

                guideMessage.textContent =
                    "Google Maps Demo Key is active. Downtown routes now follow street-locked Davao route sequences and are cached after first load.";

                renderGuideMapRoutes();
            }
            catch (error) {
                console.error(
                    "Google Maps initialization failed:",
                    error
                );

                show(guideMapSetup);

                guideMapSetup.querySelector("strong").textContent =
                    "Google Maps could not load";

                guideMapSetup.querySelector("span").textContent =
                    "Check that your Maps Demo Key was copied correctly. This build does not require you to enable billing.";
            }
        }

        function clearGoogleMapRouteOverlays() {
            googleRoutePolylines.forEach(
                function (polyline) {
                    polyline.setMap(null);
                }
            );

            googleRoutePolylines = [];

            googleRouteMarkers.forEach(
                function (marker) {
                    marker.map = null;
                }
            );

            googleRouteMarkers = [];
        }

        function normalizeGoogleAnchor(anchor) {
            if (
                typeof anchor === "string" &&
                !anchor.toLowerCase().includes("davao")
            ) {
                return anchor +
                    ", Davao City, Philippines";
            }

            return anchor;
        }

        function getGoogleRouteSegmentsForRoute(route) {
            if (
                route.googleRouteSegments &&
                route.googleRouteSegments.length
            ) {
                return route.googleRouteSegments
                    .map(function (segment) {
                        return segment
                            .map(normalizeGoogleAnchor)
                            .filter(Boolean);
                    })
                    .filter(function (segment) {
                        return segment.length >= 2;
                    });
            }

            if (
                route.googleAnchors &&
                route.googleAnchors.length >= 2
            ) {
                return [
                    route.googleAnchors
                        .map(normalizeGoogleAnchor)
                ];
            }

            const landmarkAnchors =
                (route.landmarks || [])
                    .slice(0, 6)
                    .map(function (landmark) {
                        return normalizeGoogleAnchor(
                            landmark
                        );
                    });

            if (landmarkAnchors.length < 2) {
                return [];
            }

            return [
                landmarkAnchors
            ];
        }

        function getPersistentRouteCacheKey(routeId) {
            return [
                "larga-route-geometry",
                DOWNTOWN_GEOMETRY_VERSION,
                routeId
            ].join(":");
        }

        function readPersistentRoutePath(routeId) {
            try {
                const raw =
                    window.localStorage.getItem(
                        getPersistentRouteCacheKey(
                            routeId
                        )
                    );

                if (!raw) {
                    return null;
                }

                const parsed =
                    JSON.parse(raw);

                if (
                    !Array.isArray(parsed) ||
                    parsed.length < 2
                ) {
                    return null;
                }

                const valid =
                    parsed.every(
                        function (point) {
                            return (
                                point &&
                                Number.isFinite(
                                    Number(point.lat)
                                ) &&
                                Number.isFinite(
                                    Number(point.lng)
                                )
                            );
                        }
                    );

                if (!valid) {
                    return null;
                }

                return parsed.map(
                    function (point) {
                        return {
                            lat:
                                Number(point.lat),

                            lng:
                                Number(point.lng)
                        };
                    }
                );
            }
            catch (error) {
                console.warn(
                    "Could not read cached route geometry:",
                    error
                );

                return null;
            }
        }

        function savePersistentRoutePath(
            routeId,
            path
        ) {
            try {
                window.localStorage.setItem(
                    getPersistentRouteCacheKey(
                        routeId
                    ),

                    JSON.stringify(
                        path
                    )
                );
            }
            catch (error) {
                console.warn(
                    "Could not cache route geometry:",
                    error
                );
            }
        }

        function appendRouteSegment(
            target,
            segment
        ) {
            if (
                !segment ||
                !segment.length
            ) {
                return;
            }

            if (!target.length) {
                segment.forEach(
                    function (point) {
                        target.push(point);
                    }
                );

                return;
            }

            const previous =
                target[
                    target.length - 1
                ];

            segment.forEach(
                function (point, index) {

                    if (
                        index === 0 &&
                        Math.abs(
                            previous.lat -
                            point.lat
                        ) < 0.00001 &&
                        Math.abs(
                            previous.lng -
                            point.lng
                        ) < 0.00001
                    ) {
                        return;
                    }

                    target.push(point);
                }
            );
        }

        async function computeRouteSegmentWithDemoKey(
            anchors
        ) {
            if (
                !hasGoogleMapsDemoKey() ||
                anchors.length < 2
            ) {
                throw new Error(
                    "A Maps Demo Key and at least two street anchors are required."
                );
            }

            if (anchors.length > 27) {
                throw new Error(
                    "A route segment exceeded Google's waypoint limit."
                );
            }

            const intermediateWaypoints =
                anchors
                    .slice(1, -1)
                    .map(function (address) {
                        return {
                            address:
                                address,

                            // These are pass-through constraints. Google can
                            // shape the road-following polyline, but it may not
                            // reorder or skip the published street sequence.
                            via:
                                true
                        };
                    });

            const requestBody = {
                origin: {
                    address:
                        anchors[0]
                },

                destination: {
                    address:
                        anchors[
                            anchors.length - 1
                        ]
                },

                intermediates:
                    intermediateWaypoints,

                travelMode:
                    "DRIVE",

                routingPreference:
                    "TRAFFIC_UNAWARE",

                polylineQuality:
                    "HIGH_QUALITY",

                polylineEncoding:
                    "GEO_JSON_LINESTRING",

                regionCode:
                    "ph",

                languageCode:
                    "en-US"
            };

            const response =
                await fetch(
                    "https://routes.googleapis.com/directions/v2:computeRoutes",
                    {
                        method:
                            "POST",

                        headers: {
                            "Content-Type":
                                "application/json",

                            "X-Goog-Api-Key":
                                LARGA_GOOGLE_MAPS_CONFIG.demoKey,

                            "X-Goog-FieldMask":
                                "routes.polyline.geoJsonLinestring"
                        },

                        body:
                            JSON.stringify(
                                requestBody
                            )
                    }
                );

            if (!response.ok) {
                let errorMessage =
                    "Compute Routes request failed with HTTP " +
                    response.status +
                    ".";

                try {
                    const errorData =
                        await response.json();

                    if (
                        errorData &&
                        errorData.error &&
                        errorData.error.message
                    ) {
                        errorMessage +=
                            " " +
                            errorData.error.message;
                    }
                }
                catch (error) {
                    // Keep the HTTP status message.
                }

                throw new Error(
                    errorMessage
                );
            }

            const result =
                await response.json();

            const lineString =
                result &&
                result.routes &&
                result.routes[0] &&
                result.routes[0].polyline &&
                result.routes[0].polyline
                    .geoJsonLinestring;

            if (
                !lineString ||
                !Array.isArray(
                    lineString.coordinates
                ) ||
                lineString.coordinates.length < 2
            ) {
                throw new Error(
                    "Google returned no usable route polyline."
                );
            }

            return lineString.coordinates
                .map(function (coordinate) {
                    return {
                        lat:
                            Number(
                                coordinate[1]
                            ),

                        lng:
                            Number(
                                coordinate[0]
                            )
                    };
                })
                .filter(function (point) {
                    return (
                        Number.isFinite(
                            point.lat
                        ) &&
                        Number.isFinite(
                            point.lng
                        )
                    );
                });
        }

        async function computeGoogleRoutePath(route) {
            if (
                googleRoutePathCache.has(route.id)
            ) {
                return googleRoutePathCache.get(
                    route.id
                );
            }

            const persistentPath =
                readPersistentRoutePath(
                    route.id
                );

            if (persistentPath) {
                googleRoutePathCache.set(
                    route.id,
                    persistentPath
                );

                return persistentPath;
            }

            if (
                googleRoutePathPromiseCache.has(
                    route.id
                )
            ) {
                return googleRoutePathPromiseCache.get(
                    route.id
                );
            }

            const routePromise =
                (async function () {

                    const segments =
                        getGoogleRouteSegmentsForRoute(
                            route
                        );

                    if (!segments.length) {
                        throw new Error(
                            "No street sequence is available for " +
                            route.name +
                            "."
                        );
                    }

                    const segmentPaths =
                        await Promise.all(
                            segments.map(
                                function (anchors) {
                                    return computeRouteSegmentWithDemoKey(
                                        anchors
                                    );
                                }
                            )
                        );

                    const path = [];

                    segmentPaths.forEach(
                        function (segmentPath) {
                            appendRouteSegment(
                                path,
                                segmentPath
                            );
                        }
                    );

                    if (path.length < 2) {
                        throw new Error(
                            "No road-following path returned for " +
                            route.name +
                            "."
                        );
                    }

                    googleRoutePathCache.set(
                        route.id,
                        path
                    );

                    savePersistentRoutePath(
                        route.id,
                        path
                    );

                    return path;

                })();

            googleRoutePathPromiseCache.set(
                route.id,
                routePromise
            );

            try {
                return await routePromise;
            }
            finally {
                googleRoutePathPromiseCache.delete(
                    route.id
                );
            }
        }

        function createGoogleJeepMarker(
            route,
            position,
            index,
            dimmed
        ) {
            if (
                !GoogleAdvancedMarkerElement ||
                !googleGuideMap ||
                !position
            ) {
                return null;
            }

            const markerShell =
                document.createElement("div");

            markerShell.className =
                "google-jeep-marker";

            if (dimmed) {
                markerShell.classList.add(
                    "is-dimmed"
                );
            }

            markerShell.style.setProperty(
                "--route-color",
                getRouteAccent(route)
            );

            markerShell.innerHTML =
                "<span>🚐</span>";

            const marker =
                new GoogleAdvancedMarkerElement({
                    map:
                        googleGuideMap,

                    position:
                        position,

                    title:
                        route.name +
                        " jeepney " +
                        (index + 1),

                    zIndex:
                        30 + index
                });

            marker.append(
                markerShell
            );

            return marker;
        }

        function updateGoogleUserMarker(
            latitude,
            longitude,
            shouldPan
        ) {
            if (
                !googleGuideMap ||
                !GoogleAdvancedMarkerElement
            ) {
                return;
            }

            const position = {
                lat: latitude,
                lng: longitude
            };

            if (!googleUserMarker) {
                const userDot =
                    document.createElement("div");

                userDot.className =
                    "google-user-location";

                userDot.innerHTML =
                    "<span></span>";

                googleUserMarker =
                    new GoogleAdvancedMarkerElement({
                        map:
                            googleGuideMap,
                        position:
                            position,
                        title:
                            "Your location",
                        zIndex:
                            100
                    });

                googleUserMarker.append(
                    userDot
                );
            }
            else {
                googleUserMarker.position =
                    position;

                googleUserMarker.map =
                    googleGuideMap;
            }

            if (shouldPan) {
                googleGuideMap.panTo(
                    position
                );

                if (
                    googleGuideMap.getZoom() < 15
                ) {
                    googleGuideMap.setZoom(
                        15
                    );
                }
            }
        }

        async function renderGoogleGuideMapRoutes(
            selectedRoutes
        ) {
            if (!googleGuideMap) {
                return;
            }

            const renderGeneration =
                ++googleMapRenderGeneration;

            clearGoogleMapRouteOverlays();

            if (!selectedRoutes.length) {
                googleGuideMap.setCenter(
                    DAVAO_MAP_CENTER
                );

                googleGuideMap.setZoom(
                    13
                );

                return;
            }

            const results =
                await Promise.all(
                    selectedRoutes.map(
                        async function (
                            route,
                            routeIndex
                        ) {
                            try {
                                return {
                                    route:
                                        route,

                                    routeIndex:
                                        routeIndex,

                                    path:
                                        await computeGoogleRoutePath(
                                            route
                                        )
                                };
                            }
                            catch (error) {
                                console.warn(
                                    "Could not compute " +
                                    route.name +
                                    ":",
                                    error
                                );

                                return {
                                    route:
                                        route,

                                    routeIndex:
                                        routeIndex,

                                    path:
                                        null,

                                    error:
                                        error
                                };
                            }
                        }
                    )
                );

            if (
                renderGeneration !==
                googleMapRenderGeneration
            ) {
                return;
            }

            const bounds =
                new GoogleLatLngBounds();

            let successfulRoutes =
                0;

            let failedRoutes =
                0;

            results.forEach(
                function (result) {

                    const route =
                        result.route;

                    const path =
                        result.path;

                    if (
                        !path ||
                        path.length < 2
                    ) {
                        failedRoutes += 1;
                        return;
                    }

                    successfulRoutes += 1;

                    const accent =
                        getRouteAccent(route);

                    const dimmed =
                        currentTripPlan &&
                        focusedJourneyRouteId &&
                        focusedJourneyRouteId !==
                            route.id;

                    const focused =
                        currentTripPlan &&
                        focusedJourneyRouteId ===
                            route.id;

                    const routeHalo =
                        new GooglePolyline({
                            map:
                                googleGuideMap,

                            path:
                                path,

                            strokeColor:
                                "#ffffff",

                            strokeOpacity:
                                dimmed
                                    ? 0.24
                                    : 0.82,

                            strokeWeight:
                                focused
                                    ? 10
                                    : 8,

                            clickable:
                                false,

                            zIndex:
                                10 +
                                result.routeIndex * 2
                        });

                    const routeLine =
                        new GooglePolyline({
                            map:
                                googleGuideMap,

                            path:
                                path,

                            strokeColor:
                                accent,

                            strokeOpacity:
                                dimmed
                                    ? 0.30
                                    : 0.92,

                            strokeWeight:
                                focused
                                    ? 7
                                    : 5,

                            clickable:
                                false,

                            zIndex:
                                11 +
                                result.routeIndex * 2
                        });

                    googleRoutePolylines.push(
                        routeHalo,
                        routeLine
                    );

                    path.forEach(
                        function (point) {
                            bounds.extend(
                                point
                            );
                        }
                    );

                    // GUIDE PAGE:
                    // Do not render live jeepney markers here.
                    // Vehicle positions belong exclusively to the Live page.
                }
            );

            if (
                successfulRoutes > 0 &&
                !bounds.isEmpty()
            ) {
                googleGuideMap.fitBounds(
                    bounds,
                    58
                );

                google.maps.event.addListenerOnce(
                    googleGuideMap,
                    "idle",
                    function () {
                        const zoom =
                            googleGuideMap.getZoom();

                        if (zoom > 16) {
                            googleGuideMap.setZoom(
                                16
                            );
                        }
                    }
                );
            }

            if (failedRoutes > 0) {
                guideMessage.textContent =
                    failedRoutes === selectedRoutes.length
                        ? "Google Maps loaded, but the Demo Key route request could not be completed. Check the browser console for the exact Google response."
                        : failedRoutes + " selected route" +
                          (failedRoutes > 1 ? "s" : "") +
                          " could not be computed with the Demo Key.";
            }
        }


        function renderGuideMapRoutes() {
            guideRouteLayers.innerHTML = "";
            guideMapStops.innerHTML = "";
            guideMapJeeps.innerHTML = "";
            guideMapJourneyMarkers.innerHTML = "";

            const selectedRoutes = Array.from(selectedGuideRouteIds)
                .map(getRouteById)
                .filter(Boolean);

            if (googleGuideMap) {
                renderGoogleGuideMapRoutes(
                    selectedRoutes
                );
            }

            if (selectedRoutes.length === 0) {
                guideMapEyebrow.textContent =
                    googleGuideMap
                        ? "GOOGLE MAPS"
                        : "MAP PREVIEW";
                guideMapRouteName.textContent = "Select a route";
                guideMapRouteDot.style.background = "#a9b0b7";
                guideMapSelectionHint.classList.remove("has-route");
                updateGuideHeaderAction();
                return;
            }

            guideMapSelectionHint.classList.add("has-route");

            if (currentTripPlan) {
                guideMapEyebrow.textContent = "PLANNED JOURNEY";
                guideMapRouteName.textContent = `${currentTripPlan.legs.length} ride${currentTripPlan.legs.length > 1 ? "s" : ""}`;
                guideMapRouteDot.style.background = "var(--larga-orange)";
            }
            else if (selectedRoutes.length === 1) {
                guideMapEyebrow.textContent =
                    googleGuideMap
                        ? "GOOGLE MAPS"
                        : "MAP PREVIEW";
                guideMapRouteName.textContent = selectedRoutes[0].name;
                guideMapRouteDot.style.background = getRouteAccent(selectedRoutes[0]);
            }
            else {
                guideMapEyebrow.textContent = "COMPARING ROUTES";
                guideMapRouteName.textContent = `${selectedRoutes.length} routes selected`;
                guideMapRouteDot.style.background = "var(--larga-orange)";
            }

            if (googleGuideMap) {
                updateGuideHeaderAction();
                return;
            }

            selectedRoutes.forEach(function (route, routeIndex) {
                const accent = getRouteAccent(route);
                const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
                path.setAttribute("class", "guide-selected-route route-visible multi-route-path");
                path.setAttribute("d", getRouteMapPath(route));
                path.setAttribute("data-route-id", route.id);
                path.style.stroke = accent;
                path.style.animationDelay = `${routeIndex * 0.08}s`;

                const dimmed = currentTripPlan && focusedJourneyRouteId && focusedJourneyRouteId !== route.id;
                if (dimmed) {
                    path.classList.add("dimmed-route-path");
                }
                if (currentTripPlan && focusedJourneyRouteId === route.id) {
                    path.classList.add("focused-route-path");
                }

                guideRouteLayers.appendChild(path);

                // Guide fallback map intentionally omits live jeepney markers.
                if (selectedRoutes.length <= 3) {
                    const stopPositions = [
                        [24 + routeIndex * 4, 72 - routeIndex * 5],
                        [61 + routeIndex * 3, 41 + routeIndex * 3]
                    ];
                    stopPositions.forEach(function (position) {
                        const stop = document.createElement("span");
                        stop.className = "guide-map-stop";
                        if (dimmed) stop.classList.add("dimmed-map-object");
                        stop.style.left = position[0] + "%";
                        stop.style.top = position[1] + "%";
                        stop.style.setProperty("--route-color", accent);
                        guideMapStops.appendChild(stop);
                    });
                }
            });

            if (currentTripPlan) {
                renderJourneyMapMarkers(currentTripPlan);
            }

            updateGuideHeaderAction();
        }

        function renderJourneyMapMarkers(plan) {
            const markerPositions = plan.legs.length === 1
                ? [[13, 78], [84, 25]]
                : plan.legs.length === 2
                    ? [[12, 78], [50, 52], [86, 24]]
                    : [[11, 79], [36, 62], [63, 43], [87, 23]];

            const labels = [plan.start]
                .concat(plan.transfers)
                .concat([plan.end]);

            markerPositions.slice(0, labels.length).forEach(function (position, index) {
                const marker = document.createElement("div");
                marker.className = "journey-map-marker";
                marker.style.left = position[0] + "%";
                marker.style.top = position[1] + "%";

                if (index === 0) {
                    marker.classList.add("journey-start-marker");
                    marker.innerHTML = `<b>START</b><span>${labels[index]}</span>`;
                }
                else if (index === labels.length - 1) {
                    marker.classList.add("journey-end-marker");
                    marker.innerHTML = `<b>DESTINATION</b><span>${labels[index]}</span>`;
                }
                else {
                    marker.classList.add("journey-transfer-marker");
                    marker.innerHTML = `<b>TRANSFER ${index}</b><span>${labels[index]}</span>`;
                }

                guideMapJourneyMarkers.appendChild(marker);
            });
        }

        function focusJourneyLeg(routeId) {
            focusedJourneyRouteId = routeId || null;
            if (routeId) {
                selectedGuideRoute = getRouteById(routeId);
                if (selectedGuideRoute) {
                    routeName.textContent = selectedGuideRoute.name;
                }
            }

            document.querySelectorAll(".journey-route-card").forEach(function (card) {
                const cardRouteId = card.getAttribute("data-route-id");
                card.classList.toggle("focused-journey-card", !!routeId && cardRouteId === routeId);
                card.classList.toggle("dimmed-journey-card", !!routeId && cardRouteId !== routeId);
            });

            renderGuideMapRoutes();
        }

        let expandedRouteCardState = null;
        let routeDetailAnimating = false;
        let routeDetailRevealTimer = null;

        function setExpandedCardGeometry(card, geometry) {
            card.style.position = "absolute";
            card.style.left = geometry.left + "px";
            card.style.top = geometry.top + "px";
            card.style.width = geometry.width + "px";
            card.style.minWidth = geometry.width + "px";
            card.style.height = geometry.height + "px";
            card.style.margin = "0";
            card.style.zIndex = "2";
            card.style.transform = "none";
            card.style.transformOrigin = "center center";
        }

        function clearExpandedCardGeometry(card) {
            [
                "position",
                "left",
                "top",
                "width",
                "min-width",
                "height",
                "margin",
                "z-index",
                "transform",
                "transform-origin"
            ].forEach(function (property) {
                card.style.removeProperty(property);
            });
        }

        function restoreExpandedRouteCard(immediate) {
            if (!expandedRouteCardState) {
                routeDetailOverlay.classList.remove("is-open", "card-morph-open");
                routeDetailOverlay.setAttribute("aria-hidden", "true");
                return;
            }

            const state = expandedRouteCardState;
            const card = state.card;
            const placeholder = state.placeholder;

            if (routeDetailRevealTimer) {
                clearTimeout(routeDetailRevealTimer);
                routeDetailRevealTimer = null;
            }

            routeDetailAnimating = true;

            let detailFadeAnimation = null;
            let backdropFadeAnimation = null;
            let closingAnimation = null;

            function finishRestore() {
                /*
                 * Important ordering:
                 * 1. Keep the completed fade effects in place.
                 * 2. Move the card back while hidden from paint.
                 * 3. Normalize its classes/inline geometry with transitions disabled.
                 * 4. Remove the overlay state.
                 * 5. Only then cancel the WAAPI fade effects.
                 *
                 * Cancelling the backdrop animation before removing
                 * `card-morph-open` briefly restored opacity:1 and caused the
                 * one-frame flash/jitter visible after closing.
                 */

                card.style.visibility = "hidden";
                card.style.transition = "none";

                routeDetailOverlay.appendChild(routeDetailGlass);
                placeholder.replaceWith(card);

                card.classList.remove(
                    "route-card-expanded",
                    "route-card-morphing",
                    "route-card-morphing-out",
                    "route-card-details-visible",
                    "route-card-show-mini",
                    "detail-source-hidden"
                );

                clearExpandedCardGeometry(card);

                // Force the normal mini-card geometry to resolve while hidden.
                card.getBoundingClientRect();

                // Remove the overlay state while the backdrop is still held at
                // opacity 0 by the completed animation.
                routeDetailOverlay.classList.remove("is-open", "card-morph-open");
                routeDetailOverlay.setAttribute("aria-hidden", "true");

                routeDetailGlass.style.removeProperty("opacity");

                // Now it is safe to release the finished animation effects.
                if (detailFadeAnimation) {
                    detailFadeAnimation.cancel();
                }
                if (backdropFadeAnimation) {
                    backdropFadeAnimation.cancel();
                }

                // Reveal the normalized card itself immediately, then
                // cross-fade the mini-card typography. This prevents the
                // expanded title from ever reflowing into the mini-card layout.
                card.classList.add(
                    "route-card-returned"
                );

                card.style.visibility =
                    "visible";

                expandedRouteCardState =
                    null;

                routeDetailAnimating =
                    false;

                requestAnimationFrame(
                    function () {

                        card.classList.add(
                            "route-card-returned-visible"
                        );

                        card.style.removeProperty(
                            "transition"
                        );

                        card.style.removeProperty(
                            "visibility"
                        );

                        setTimeout(
                            function () {
                                card.classList.remove(
                                    "route-card-returned",
                                    "route-card-returned-visible"
                                );
                            },
                            190
                        );
                    }
                );
            }

            if (immediate) {
                finishRestore();
                return;
            }

            const overlayRect = routeDetailOverlay.getBoundingClientRect();
            const currentRect = card.getBoundingClientRect();
            const placeholderRect = placeholder.getBoundingClientRect();

            const current = {
                left: currentRect.left - overlayRect.left,
                top: currentRect.top - overlayRect.top,
                width: currentRect.width,
                height: currentRect.height
            };

            const target = {
                left: placeholderRect.left - overlayRect.left,
                top: placeholderRect.top - overlayRect.top,
                width: placeholderRect.width,
                height: placeholderRect.height
            };

            card.classList.add("route-card-morphing-out");

            // Detail content fades while the card is already returning.
            detailFadeAnimation = routeDetailGlass.animate(
                [
                    {
                        opacity: 1,
                        offset: 0
                    },
                    {
                        opacity: 0.82,
                        offset: 0.18
                    },
                    {
                        opacity: 0,
                        offset: 0.56
                    },
                    {
                        opacity: 0,
                        offset: 1
                    }
                ],
                {
                    duration: 360,
                    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
                    fill: "forwards"
                }
            );

            // The blur dissolves continuously throughout almost the entire
            // return motion. It never flashes back to full opacity.
            backdropFadeAnimation = routeDetailBackdrop.animate(
                [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                {
                    duration: 350,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            );

            // Put the underlying box at the final geometry first. WAAPI then
            // draws the visual interpolation from the expanded rectangle to it.
            card.style.left = target.left + "px";
            card.style.top = target.top + "px";
            card.style.width = target.width + "px";
            card.style.minWidth = target.width + "px";
            card.style.height = target.height + "px";

            closingAnimation = card.animate(
                [
                    {
                        left: current.left + "px",
                        top: current.top + "px",
                        width: current.width + "px",
                        height: current.height + "px",
                        borderRadius: "30px"
                    },
                    {
                        left: target.left + "px",
                        top: target.top + "px",
                        width: target.width + "px",
                        height: target.height + "px",
                        borderRadius: "23px"
                    }
                ],
                {
                    duration: 360,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "none"
                }
            );

            closingAnimation.onfinish = finishRestore;
            closingAnimation.oncancel = function () {
                if (expandedRouteCardState) {
                    finishRestore();
                }
            };
        }

        function openRouteDetail(routeId, sourceCard) {
            const route = getRouteById(routeId);
            if (!route || routeDetailAnimating) return;

            if (expandedRouteCardState) {
                restoreExpandedRouteCard(true);
            }

            const card = sourceCard || document.querySelector(
                '.guide-route-card[data-route-id="' + routeId + '"]'
            );
            if (!card) return;

            selectedGuideRoute = route;
            routeName.textContent = route.name;
            routeDetailSummary.textContent = route.summary;
            routeDetailStatus.textContent = route.frequency === "Limited"
                ? "LIMITED / LESS FREQUENT"
                : "ROUTE REFERENCE";
            routeLandmarkChips.innerHTML = "";

            route.landmarks.forEach(function (landmark) {
                const chip = document.createElement("span");
                chip.className = "route-landmark-chip";
                chip.textContent = landmark;
                routeLandmarkChips.appendChild(chip);
            });

            routeDetailRoads.textContent = route.roads.join(" • ");
            routeDetailGlass.style.setProperty("--route-primary", route.primary);
            routeDetailGlass.style.setProperty("--route-secondary", route.secondary);
            routeDetailGlass.style.setProperty("--route-accent", getRouteAccent(route));
            routeDetailGlass.style.setProperty("--route-text", getReadableRouteText(route));
            saveCurrentRouteButton.textContent = "☆ Save Route";
            saveMessage.textContent = "";

            const cardRect = card.getBoundingClientRect();
            const mainRect = mainApp.getBoundingClientRect();
            const placeholder = document.createElement("div");
            placeholder.className = "route-card-placeholder";
            placeholder.style.width = cardRect.width + "px";
            placeholder.style.minWidth = cardRect.width + "px";
            placeholder.style.height = cardRect.height + "px";
            card.parentNode.insertBefore(placeholder, card);

            const start = {
                left: cardRect.left - mainRect.left,
                top: cardRect.top - mainRect.top,
                width: cardRect.width,
                height: cardRect.height
            };

            // Size the expanded card to the amount of route information rather
            // than using a tall fixed panel. This removes the large empty area
            // on short routes while still allowing room for longer ones.
            const landmarkRows = Math.ceil(route.landmarks.length / 2);
            const roadRows = Math.max(1, Math.ceil(route.roads.length / 4));
            const estimatedContentHeight =
                320 +
                landmarkRows * 31 +
                roadRows * 18;

            const targetWidth = Math.min(mainRect.width - 28, 365);
            const targetHeight = Math.min(
                mainRect.height - 190,
                Math.max(420, Math.min(485, estimatedContentHeight))
            );
            const target = {
                left: (mainRect.width - targetWidth) / 2,
                top: (mainRect.height - targetHeight) / 2 - 4,
                width: targetWidth,
                height: targetHeight
            };

            expandedRouteCardState = {
                card: card,
                placeholder: placeholder,
                sourceRect: {
                    left: cardRect.left,
                    top: cardRect.top,
                    width: cardRect.width,
                    height: cardRect.height
                }
            };

            routeDetailOverlay.classList.add("card-morph-open", "is-open");
            routeDetailOverlay.setAttribute("aria-hidden", "false");
            routeDetailOverlay.appendChild(card);
            card.appendChild(routeDetailGlass);

            card.classList.add("route-card-expanded", "route-card-morphing");
            setExpandedCardGeometry(card, target);
            routeDetailAnimating = true;

            const dx = start.left - target.left;
            const dy = start.top - target.top;
            const scaleX = start.width / target.width;
            const scaleY = start.height / target.height;

            const animation = card.animate(
                [
                    {
                        transform:
                            "translate3d(" + dx + "px, " + dy + "px, 0) " +
                            "scale(" + scaleX + ", " + scaleY + ")",
                        borderRadius: "23px"
                    },
                    {
                        transform: "translate3d(0, 0, 0) scale(1, 1)",
                        borderRadius: "30px"
                    }
                ],
                {
                    duration: 470,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            );

            routeDetailRevealTimer = setTimeout(function () {
                card.classList.add("route-card-details-visible");
            }, 165);

            animation.onfinish = function () {
                animation.cancel();
                card.classList.remove("route-card-morphing");
                routeDetailAnimating = false;
            };
        }

        function closeRouteDetail(immediate) {
            restoreExpandedRouteCard(!!immediate);
        }

        closeRouteDetailButton.addEventListener("click", function () {
            closeRouteDetail(false);
        });
        routeDetailBackdrop.addEventListener("click", function () {
            closeRouteDetail(false);
        });

        document.addEventListener("keydown", function (event) {
            if (event.key === "Escape" && routeDetailOverlay.classList.contains("is-open")) {
                closeRouteDetail();
            }
        });

        function routeSearchText(route) {
            return [
                route.name,
                route.short,
                route.summary,
                route.landmarks.join(" "),
                route.roads.join(" ")
            ].join(" ").toLowerCase();
        }

        function renderRouteSearchResults(query) {
            const cleanedQuery = query.trim().toLowerCase();
            routeSearchResults.innerHTML = "";

            if (!cleanedQuery) {
                hide(routeSearchResults);
                hide(routeSearchClear);
                return;
            }

            show(routeSearchClear);

            const matches = guideRouteCatalog
                .filter(function (route) {
                    return routeSearchText(route).includes(cleanedQuery);
                })
                .slice(0, 10);

            if (!matches.length) {
                routeSearchResults.innerHTML = `
                    <div class="guide-search-empty">
                        No matching route found in the current prototype catalog.
                    </div>
                `;
                show(routeSearchResults);
                return;
            }

            matches.forEach(function (route) {
                const result = document.createElement("button");
                result.type = "button";
                result.className = "guide-search-result";
                result.style.setProperty("--search-route-color", getRouteAccent(route));
                result.innerHTML = `
                    <span class="search-route-swatch"></span>
                    <span class="search-route-copy">
                        <strong>${route.name}</strong>
                        <small>${route.landmarks.slice(0, 3).join(" • ")}</small>
                    </span>
                    <span class="search-route-chevron">›</span>
                `;

                result.addEventListener("click", function () {
                    ensureGuideRouteSelected(route.id, true);
                    routeSearchInput.value = route.name;
                    hide(routeSearchResults);
                    show(routeSearchClear);
                    routeSearchInput.blur();
                });

                routeSearchResults.appendChild(result);
            });

            show(routeSearchResults);
        }

        routeSearchInput.addEventListener("input", function () {
            renderRouteSearchResults(routeSearchInput.value);
        });

        routeSearchClear.addEventListener("click", function () {
            routeSearchInput.value = "";
            renderRouteSearchResults("");
            routeSearchInput.focus();
        });

        // ==================================================
        // TRIP PLANNER PLACE DATABASE
        // ==================================================
        //
        // Numbered Route 1-13 loops are ranked first for downtown
        // trips. Conventional routes are still included whenever
        // their known landmark/corridor coverage also serves the
        // selected places.
        //
        // Aliases collapse common Davao names such as:
        // "GMall Bajada" / "Gaisano Mall of Davao",
        // "San Pedro Church" / "San Pedro Cathedral", etc.

        const guidePlaceAliasGroups = [
            [
                "San Pedro Church",
                "San Pedro Cathedral",
                "San Pedro"
            ],
            [
                "GMall Bajada",
                "Gaisano Mall of Davao",
                "GMall"
            ],
            [
                "Abreeza Mall",
                "Ayala Malls Abreeza",
                "Abreeza"
            ],
            [
                "NCCC Uyanguren",
                "Chinatown / Uyanguren",
                "Uyanguren",
                "Chinatown"
            ],
            [
                "Magsaysay Park",
                "Ramon Magsaysay Park"
            ],
            [
                "Davao Doctors Hospital",
                "Davao Doctors",
                "DDH"
            ],
            [
                "Bankerohan Public Market",
                "Bankerohan"
            ],
            [
                "Davao City Overland Transport Terminal",
                "DCOTT",
                "Ecoland Terminal"
            ],
            [
                "SM City Davao",
                "SM Ecoland"
            ],
            [
                "SM Lanang",
                "SM Lanang Premier"
            ],
            [
                "SPMC",
                "Southern Philippines Medical Center"
            ],
            [
                "Davao City National High School",
                "City High"
            ],
            [
                "Sta. Ana",
                "Sta. Ana area",
                "Sta. Ana Public Market"
            ],
            [
                "Agdao",
                "Agdao Public Market"
            ],
            [
                "Roxas Avenue",
                "Roxas"
            ],
            [
                "Claveria",
                "C.M. Recto",
                "CM Recto"
            ]
        ];

        const guidePlaceAliasIndex = new Map();

        guidePlaceAliasGroups.forEach(function (group) {
            const canonical =
                normalizeGuideText(group[0]);

            group.forEach(function (alias) {
                guidePlaceAliasIndex.set(
                    normalizeGuideText(alias),
                    canonical
                );
            });
        });

        function canonicalGuidePlace(value) {
            const normalized =
                normalizeGuideText(value);

            return (
                guidePlaceAliasIndex.get(
                    normalized
                ) ||
                normalized
            );
        }

        function routeServesGuidePlace(route, place) {
            const target =
                canonicalGuidePlace(place);

            const routeValues = []
                .concat(route.landmarks || [])
                .concat(route.roads || [])
                .concat([
                    route.name || "",
                    route.short || ""
                ]);

            return routeValues.some(
                function (value) {

                    const candidate =
                        canonicalGuidePlace(value);

                    if (candidate === target) {
                        return true;
                    }

                    // Only use substring matching for sufficiently specific
                    // place names. This avoids generic words such as "road"
                    // creating false route matches.
                    if (
                        target.length >= 7 &&
                        candidate.length >= 7
                    ) {
                        return (
                            candidate.includes(target) ||
                            target.includes(candidate)
                        );
                    }

                    return false;
                }
            );
        }

        function getRoutesServingPlace(place) {
            return guideRouteCatalog
                .filter(function (route) {
                    return routeServesGuidePlace(
                        route,
                        place
                    );
                })
                .sort(function (a, b) {
                    return (
                        routeScore(b) -
                        routeScore(a)
                    );
                });
        }

        function getGuidePlacePriority(place) {
            const servingRoutes =
                getRoutesServingPlace(place);

            const downtownCount =
                servingRoutes.filter(
                    function (route) {
                        return route.downtown;
                    }
                ).length;

            const commonCount =
                servingRoutes.filter(
                    function (route) {
                        return route.frequency === "Common";
                    }
                ).length;

            return (
                downtownCount * 100 +
                commonCount * 12 +
                servingRoutes.length
            );
        }

        function getGuidePlaces() {
            const values = [];

            // Deliberately add numbered downtown-route landmarks first.
            guideRouteCatalog
                .filter(function (route) {
                    return route.downtown;
                })
                .forEach(function (route) {
                    (route.landmarks || [])
                        .forEach(function (landmark) {
                            values.push(landmark);
                        });
                });

            // Then add the rest of the city catalog.
            guideRouteCatalog
                .filter(function (route) {
                    return !route.downtown;
                })
                .forEach(function (route) {
                    (route.landmarks || [])
                        .forEach(function (landmark) {
                            values.push(landmark);
                        });
                });

            const uniqueByCanonical =
                new Map();

            values.forEach(function (place) {
                const key =
                    canonicalGuidePlace(place);

                if (!uniqueByCanonical.has(key)) {
                    uniqueByCanonical.set(
                        key,
                        place
                    );
                }
            });

            return Array.from(
                uniqueByCanonical.values()
            ).sort(function (a, b) {

                const priorityDifference =
                    getGuidePlacePriority(b) -
                    getGuidePlacePriority(a);

                if (priorityDifference !== 0) {
                    return priorityDifference;
                }

                return a.localeCompare(b);
            });
        }

        const guidePlaces = getGuidePlaces();
        const CURRENT_LOCATION_VALUE = "Current Location";
        let activeGuidePlaceInput = null;
        let plannerCurrentLocationSelected = false;
        let plannerCurrentLocationCoordinates = null;

        function closeGuidePlaceResults() {
            hide(guidePlaceResults);
            guidePlaceResults.innerHTML = "";
            activeGuidePlaceInput = null;
        }

        function setGuidePlaceValue(input, place) {
            input.value = place;

            if (input === tripFromInput) {
                plannerCurrentLocationSelected = false;
            }

            closeGuidePlaceResults();
            input.focus();
        }

        function getGuidePlaceSuggestionMeta(place) {
            const routes =
                getRoutesServingPlace(place);

            const downtownRoutes =
                routes.filter(function (route) {
                    return route.downtown;
                });

            if (downtownRoutes.length) {
                const routeNames =
                    downtownRoutes
                        .slice(0, 3)
                        .map(function (route) {
                            return route.name;
                        })
                        .join(" • ");

                return {
                    className:
                        "downtown-place-result",

                    label:
                        routeNames +
                        (downtownRoutes.length > 3
                            ? " +" + (downtownRoutes.length - 3)
                            : "")
                };
            }

            if (routes.length) {
                return {
                    className:
                        "",

                    label:
                        routes.length +
                        " route" +
                        (routes.length === 1 ? "" : "s") +
                        " serve this area"
                };
            }

            return {
                className:
                    "",

                label:
                    "Supported route landmark"
            };
        }

        function renderGuidePlaceResults(input) {
            activeGuidePlaceInput = input;

            const query =
                normalizeGuideText(input.value);

            guidePlaceResults.innerHTML = "";

            if (input === tripFromInput) {
                const currentLocationButton =
                    document.createElement("button");

                currentLocationButton.type =
                    "button";

                currentLocationButton.className =
                    "guide-place-result guide-current-location-result";

                currentLocationButton.innerHTML = `
                    <span class="guide-place-icon">⌖</span>
                    <span class="guide-place-copy">
                        <strong>Use my current location</strong>
                        <small>Use this device's GPS position</small>
                    </span>
                    <span class="guide-place-chevron">›</span>
                `;

                currentLocationButton
                    .addEventListener(
                        "click",
                        function () {
                            requestPlannerCurrentLocation();
                        }
                    );

                guidePlaceResults.appendChild(
                    currentLocationButton
                );
            }

            const matches =
                guidePlaces
                    .filter(function (place) {
                        if (!query) {
                            return true;
                        }

                        const normalizedPlace =
                            normalizeGuideText(place);

                        const canonicalPlace =
                            canonicalGuidePlace(place);

                        return (
                            normalizedPlace.includes(query) ||
                            canonicalPlace.includes(query) ||
                            query.includes(canonicalPlace)
                        );
                    })
                    .sort(function (a, b) {

                        // Search matches remain downtown-first.
                        const scoreDifference =
                            getGuidePlacePriority(b) -
                            getGuidePlacePriority(a);

                        if (scoreDifference !== 0) {
                            return scoreDifference;
                        }

                        return a.localeCompare(b);
                    })
                    .slice(0, 10);

            matches.forEach(function (place) {
                const result =
                    document.createElement("button");

                const meta =
                    getGuidePlaceSuggestionMeta(
                        place
                    );

                result.type =
                    "button";

                result.className =
                    "guide-place-result " +
                    meta.className;

                result.setAttribute(
                    "role",
                    "option"
                );

                result.innerHTML = `
                    <span class="guide-place-icon">⌖</span>
                    <span class="guide-place-copy">
                        <strong>${place}</strong>
                        <small>${meta.label}</small>
                    </span>
                    <span class="guide-place-chevron">›</span>
                `;

                result.addEventListener(
                    "click",
                    function () {
                        setGuidePlaceValue(
                            input,
                            place
                        );
                    }
                );

                guidePlaceResults.appendChild(
                    result
                );
            });

            if (
                !matches.length &&
                input !== tripFromInput
            ) {
                guidePlaceResults.innerHTML = `
                    <div class="guide-place-empty">
                        No supported landmark matches that search.
                    </div>
                `;
            }

            show(guidePlaceResults);
        }

        function requestPlannerCurrentLocation() {
            closeGuidePlaceResults();

            guideMessage.textContent =
                "Requesting your current location...";

            guideLocationText.textContent =
                "Locating...";

            if (!navigator.geolocation) {
                guideMessage.textContent =
                    "Your browser does not support location.";

                guideLocationText.textContent =
                    "My location";

                return;
            }

            navigator.geolocation.getCurrentPosition(
                function (position) {

                    plannerCurrentLocationSelected =
                        true;

                    plannerCurrentLocationCoordinates = {
                        latitude:
                            position.coords.latitude,

                        longitude:
                            position.coords.longitude
                    };

                    tripFromInput.value =
                        CURRENT_LOCATION_VALUE;

                    if (googleGuideMap) {
                        hide(guideUserMarker);

                        updateGoogleUserMarker(
                            position.coords.latitude,
                            position.coords.longitude,
                            false
                        );
                    }
                    else {
                        show(guideUserMarker);
                    }

                    guideLocationText.textContent =
                        "Location active";

                    guideMessage.textContent =
                        "Current location selected. Choose the nearest supported landmark for route matching while the planner database is being expanded.";

                    console.log(
                        "Planner location:",
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                function () {
                    plannerCurrentLocationSelected =
                        false;

                    plannerCurrentLocationCoordinates =
                        null;

                    tripFromInput.value =
                        "";

                    guideLocationText.textContent =
                        "My location";

                    guideMessage.textContent =
                        "Location permission was not granted.";
                }
            );
        }

        [tripFromInput, tripToInput]
            .forEach(function (input) {

                input.addEventListener(
                    "focus",
                    function () {
                        renderGuidePlaceResults(
                            input
                        );
                    }
                );

                input.addEventListener(
                    "input",
                    function () {

                        if (
                            input === tripFromInput &&
                            input.value !==
                                CURRENT_LOCATION_VALUE
                        ) {
                            plannerCurrentLocationSelected =
                                false;
                        }

                        renderGuidePlaceResults(
                            input
                        );
                    }
                );
            });

        document.addEventListener(
            "click",
            function (event) {

                if (
                    !event.target.closest(
                        ".guide-trip-planner"
                    ) &&
                    !guidePlaceResults
                        .classList
                        .contains("hidden")
                ) {
                    closeGuidePlaceResults();
                }
            }
        );

        function resolveGuidePlace(input) {
            const normalizedInput =
                normalizeGuideText(input);

            if (!normalizedInput) {
                return null;
            }

            const canonicalInput =
                canonicalGuidePlace(input);

            const exact =
                guidePlaces.find(
                    function (place) {
                        return (
                            canonicalGuidePlace(place) ===
                            canonicalInput
                        );
                    }
                );

            if (exact) {
                return exact;
            }

            return (
                guidePlaces.find(
                    function (place) {

                        const candidate =
                            canonicalGuidePlace(place);

                        return (
                            candidate.includes(
                                canonicalInput
                            ) ||
                            canonicalInput.includes(
                                candidate
                            )
                        );
                    }
                ) ||
                null
            );
        }

        function routeHasLandmark(route, landmark) {
            return routeServesGuidePlace(
                route,
                landmark
            );
        }

        function sharedLandmarks(
            routeA,
            routeB,
            excluded
        ) {
            const exclusions =
                (excluded || [])
                    .map(canonicalGuidePlace);

            const candidatePlaces = []
                .concat(routeA.landmarks || [])
                .concat(routeA.roads || []);

            const shared = [];

            candidatePlaces.forEach(
                function (place) {

                    const normalized =
                        canonicalGuidePlace(place);

                    if (
                        exclusions.includes(
                            normalized
                        )
                    ) {
                        return;
                    }

                    if (
                        routeServesGuidePlace(
                            routeB,
                            place
                        ) &&
                        !shared.some(
                            function (item) {
                                return (
                                    canonicalGuidePlace(item) ===
                                    normalized
                                );
                            }
                        )
                    ) {
                        shared.push(place);
                    }
                }
            );

            return shared;
        }

        function routeScore(route) {
            let score =
                route.downtown
                    ? 18
                    : 0;

            if (
                route.frequency === "Common"
            ) {
                score += 6;
            }

            if (
                route.frequency === "Limited"
            ) {
                score -= 5;
            }

            if (
                route.frequency === "Rare"
            ) {
                score -= 8;
            }

            return score;
        }

        function findGuideTripPlan(
            startInput,
            endInput
        ) {
            const start =
                resolveGuidePlace(
                    startInput
                );

            const end =
                resolveGuidePlace(
                    endInput
                );

            if (!start || !end) {
                return {
                    error:
                        "Choose places from the suggestions so LARGA can compare the known jeepney routes serving each area."
                };
            }

            if (
                canonicalGuidePlace(start) ===
                canonicalGuidePlace(end)
            ) {
                return {
                    error:
                        "Starting point and destination must be different places."
                };
            }

            const startingRoutes =
                guideRouteCatalog
                    .filter(function (route) {
                        return routeServesGuidePlace(
                            route,
                            start
                        );
                    })
                    .sort(function (a, b) {
                        return (
                            routeScore(b) -
                            routeScore(a)
                        );
                    });

            const endingRoutes =
                guideRouteCatalog
                    .filter(function (route) {
                        return routeServesGuidePlace(
                            route,
                            end
                        );
                    })
                    .sort(function (a, b) {
                        return (
                            routeScore(b) -
                            routeScore(a)
                        );
                    });

            const directRoutes =
                startingRoutes
                    .filter(function (route) {
                        return routeServesGuidePlace(
                            route,
                            end
                        );
                    })
                    .sort(function (a, b) {
                        return (
                            routeScore(b) -
                            routeScore(a)
                        );
                    });

            if (directRoutes.length) {
                return {
                    start:
                        start,

                    end:
                        end,

                    transfers:
                        [],

                    legs: [
                        {
                            route:
                                directRoutes[0],

                            board:
                                start,

                            alight:
                                end
                        }
                    ],

                    // Show additional valid one-ride choices instead of
                    // silently returning only the first matching route.
                    alternativeDirectRoutes:
                        directRoutes.slice(
                            1,
                            5
                        )
                };
            }

            const twoRideCandidates = [];

            startingRoutes.forEach(
                function (first) {

                    endingRoutes.forEach(
                        function (second) {

                            if (
                                first.id === second.id
                            ) {
                                return;
                            }

                            const transfers =
                                sharedLandmarks(
                                    first,
                                    second,
                                    [
                                        start,
                                        end
                                    ]
                                );

                            transfers
                                .slice(0, 2)
                                .forEach(
                                    function (
                                        transfer
                                    ) {
                                        twoRideCandidates.push({
                                            first:
                                                first,

                                            second:
                                                second,

                                            transfer:
                                                transfer,

                                            score:
                                                routeScore(first) +
                                                routeScore(second)
                                        });
                                    }
                                );
                        }
                    );
                }
            );

            twoRideCandidates.sort(
                function (a, b) {
                    return b.score - a.score;
                }
            );

            if (twoRideCandidates.length) {
                const bestTwo =
                    twoRideCandidates[0];

                return {
                    start:
                        start,

                    end:
                        end,

                    transfers: [
                        bestTwo.transfer
                    ],

                    legs: [
                        {
                            route:
                                bestTwo.first,

                            board:
                                start,

                            alight:
                                bestTwo.transfer
                        },
                        {
                            route:
                                bestTwo.second,

                            board:
                                bestTwo.transfer,

                            alight:
                                end
                        }
                    ]
                };
            }

            let bestThree =
                null;

            for (
                const first of startingRoutes
            ) {
                for (
                    const middle of guideRouteCatalog
                ) {
                    if (
                        middle.id === first.id
                    ) {
                        continue;
                    }

                    const transferOne =
                        sharedLandmarks(
                            first,
                            middle,
                            [
                                start,
                                end
                            ]
                        )[0];

                    if (!transferOne) {
                        continue;
                    }

                    for (
                        const third of endingRoutes
                    ) {
                        if (
                            third.id === first.id ||
                            third.id === middle.id
                        ) {
                            continue;
                        }

                        const transferTwo =
                            sharedLandmarks(
                                middle,
                                third,
                                [
                                    start,
                                    end,
                                    transferOne
                                ]
                            )[0];

                        if (!transferTwo) {
                            continue;
                        }

                        const score =
                            routeScore(first) +
                            routeScore(middle) +
                            routeScore(third);

                        if (
                            !bestThree ||
                            score >
                                bestThree.score
                        ) {
                            bestThree = {
                                first:
                                    first,

                                middle:
                                    middle,

                                third:
                                    third,

                                transferOne:
                                    transferOne,

                                transferTwo:
                                    transferTwo,

                                score:
                                    score
                            };
                        }
                    }
                }
            }

            if (bestThree) {
                return {
                    start:
                        start,

                    end:
                        end,

                    transfers: [
                        bestThree.transferOne,
                        bestThree.transferTwo
                    ],

                    legs: [
                        {
                            route:
                                bestThree.first,

                            board:
                                start,

                            alight:
                                bestThree.transferOne
                        },
                        {
                            route:
                                bestThree.middle,

                            board:
                                bestThree.transferOne,

                            alight:
                                bestThree.transferTwo
                        },
                        {
                            route:
                                bestThree.third,

                            board:
                                bestThree.transferTwo,

                            alight:
                                end
                        }
                    ]
                };
            }

            return {
                error:
                    "No 1-to-3 ride connection was found in the current route database for those two locations."
            };
        }


        function applyTripPlan(plan) {
            currentTripPlan = plan;
            focusedJourneyRouteId = null;
            selectedGuideRouteIds = new Set(plan.legs.map(function (leg) {
                return leg.route.id;
            }));
            selectedGuideRoute = plan.legs[0].route;
            destinationInput.value = plan.end;
            routeName.textContent = selectedGuideRoute.name;

            guideSectionKicker.textContent = "PLANNED JOURNEY";
            guideSectionTitle.textContent = "Your Route Guide";
            guideTripSummary.textContent = `${plan.legs.length} ride${plan.legs.length > 1 ? "s" : ""} • ${plan.transfers.length} transfer${plan.transfers.length === 1 ? "" : "s"} • ${plan.start} → ${plan.end}`;
            show(guideTripSummary);
            renderJourneyCards(plan);
            renderGuideMapRoutes();
            updateGuideHeaderAction();
            if (
                plan.alternativeDirectRoutes &&
                plan.alternativeDirectRoutes.length
            ) {
                guideMessage.textContent =
                    "Recommended route shown first. Swipe to compare " +
                    plan.alternativeDirectRoutes.length +
                    " other direct option" +
                    (plan.alternativeDirectRoutes.length === 1 ? "" : "s") +
                    " that also serve both locations.";
            }
            else {
                guideMessage.textContent =
                    "Tap a ride card to focus that leg. All trip routes remain visible on the map.";
            }
        }

        function resetTripPlanView() {
            currentTripPlan = null;
            focusedJourneyRouteId = null;
            selectedGuideRouteIds.clear();
            selectedGuideRoute = null;
            guideSectionKicker.textContent = "DAVAO CITY";
            guideSectionTitle.textContent = "Popular Downtown Routes";
            hide(guideTripSummary);
            guideMessage.textContent = "";
            renderDowntownRouteCards();
            renderGuideMapRoutes();
        }

        function setGuideMode(mode) {
            currentGuideMode = mode;
            const planning = mode === "plan";
            browseRoutesModeButton.classList.toggle("active-guide-mode", !planning);
            planTripModeButton.classList.toggle("active-guide-mode", planning);
            browseRoutesPanel.classList.toggle("hidden", planning);
            tripPlannerPanel.classList.toggle("hidden", !planning);
            guidePageElement.classList.toggle("trip-planner-mode", planning);

            if (!planning) {
                resetTripPlanView();
            }
            else {
                guideMessage.textContent =
                    "Choose a starting point and destination. Downtown routes are prioritized, then LARGA checks other routes that serve the same locations.";
            }
        }

        browseRoutesModeButton.addEventListener("click", function () {
            setGuideMode("browse");
        });

        planTripModeButton.addEventListener("click", function () {
            setGuideMode("plan");
        });

        findGuideTripButton.addEventListener("click", function () {
            if (
                plannerCurrentLocationSelected ||
                normalizeGuideText(tripFromInput.value) === normalizeGuideText(CURRENT_LOCATION_VALUE)
            ) {
                guideMessage.textContent = "Current location is active. Route matching from live GPS will be enabled with the Google Maps integration. For now, choose the nearest supported landmark as your starting point.";
                tripFromInput.focus();
                renderGuidePlaceResults(tripFromInput);
                return;
            }

            const plan = findGuideTripPlan(tripFromInput.value, tripToInput.value);
            if (plan.error) {
                guideMessage.textContent = plan.error;
                return;
            }
            applyTripPlan(plan);
        });

        [tripFromInput, tripToInput].forEach(function (input) {
            input.addEventListener("keydown", function (event) {
                if (event.key === "Enter") {
                    event.preventDefault();
                    findGuideTripButton.click();
                }
            });
        });

        guideHeaderAction.addEventListener("click", function () {
            if (currentGuideMode === "plan" && currentTripPlan) {
                resetTripPlanView();
                return;
            }
            clearGuideRoutes();
        });

        useLocationButton.addEventListener("click", function () {
            guideMessage.textContent = "Requesting your current location...";
            guideLocationText.textContent = "Locating...";

            if (!navigator.geolocation) {
                guideMessage.textContent = "Your browser does not support location.";
                guideLocationText.textContent = "My location";
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    plannerCurrentLocationCoordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    if (googleGuideMap) {
                        hide(guideUserMarker);

                        updateGoogleUserMarker(
                            position.coords.latitude,
                            position.coords.longitude,
                            true
                        );

                        guideMessage.textContent =
                            "Current location enabled on Google Maps.";
                    }
                    else {
                        show(guideUserMarker);

                        guideMessage.textContent =
                            "Current location enabled for the prototype map.";
                    }

                    guideLocationText.textContent = "Location active";

                    console.log(
                        "Guide location:",
                        position.coords.latitude,
                        position.coords.longitude
                    );
                },
                function () {
                    guideLocationText.textContent = "My location";
                    guideMessage.textContent = "Location permission was not granted.";
                }
            );
        });

        const noActiveTrip = get("noActiveTrip");
        const activeTrip = get("activeTrip");
        const activeTripRoute = get("activeTripRoute");
        const activeTripDestination = get("activeTripDestination");

        startTripButton.addEventListener("click", function () {
            if (!selectedGuideRoute) return;

            if (currentTripPlan) {
                activeTripRoute.textContent = `${currentTripPlan.legs.length}-ride journey`;
                activeTripDestination.textContent = `${currentTripPlan.start} → ${currentTripPlan.end}`;
            }
            else {
                activeTripRoute.textContent = selectedGuideRoute.name;
                activeTripDestination.textContent = "Following " + selectedGuideRoute.short;
            }

            hide(noActiveTrip);
            show(activeTrip);
            resetTripSteps();
            closeRouteDetail(true);
            openPage("trips");
        });

        // Mouse drag for desktop. Pointer capture only starts after the
        // movement passes the drag threshold so a normal click reaches
        // the route-card button reliably.
        let routeCarouselPointerDown = false;
        let routeCarouselStartX = 0;
        let routeCarouselStartScroll = 0;
        let routeCarouselMoved = false;
        let routeCarouselPointerId = null;

        routeCarousel.addEventListener("pointerdown", function (event) {
            if (event.pointerType !== "mouse" || event.target.closest(".route-card-more")) {
                return;
            }
            routeCarouselPointerDown = true;
            routeCarouselMoved = false;
            routeCarouselPointerId = event.pointerId;
            routeCarouselStartX = event.clientX;
            routeCarouselStartScroll = routeCarousel.scrollLeft;
        });

        routeCarousel.addEventListener("pointermove", function (event) {
            if (!routeCarouselPointerDown || event.pointerType !== "mouse") return;

            const movement = event.clientX - routeCarouselStartX;
            if (!routeCarouselMoved && Math.abs(movement) > 8) {
                routeCarouselMoved = true;
                routeCarousel.classList.add("is-dragging");
                routeCarousel.setPointerCapture(event.pointerId);
            }

            if (routeCarouselMoved) {
                routeCarousel.scrollLeft = routeCarouselStartScroll - movement;
                event.preventDefault();
            }
        });

        function finishRouteCarouselDrag(event) {
            if (!routeCarouselPointerDown) return;
            routeCarouselPointerDown = false;
            routeCarousel.classList.remove("is-dragging");

            if (
                routeCarouselMoved &&
                event &&
                routeCarouselPointerId !== null &&
                routeCarousel.hasPointerCapture(routeCarouselPointerId)
            ) {
                routeCarousel.releasePointerCapture(routeCarouselPointerId);
            }

            routeCarouselPointerId = null;
            setTimeout(function () {
                routeCarouselMoved = false;
            }, 0);
        }

        routeCarousel.addEventListener("pointerup", finishRouteCarouselDrag);
        routeCarousel.addEventListener("pointercancel", finishRouteCarouselDrag);

        routeCarousel.addEventListener("click", function (event) {
            if (routeCarouselMoved) {
                event.preventDefault();
                event.stopPropagation();
                event.stopImmediatePropagation();
            }
        }, true);

        routeCarousel.addEventListener("wheel", function (event) {
            const horizontalIntent = Math.abs(event.deltaX) > Math.abs(event.deltaY);
            const amount = horizontalIntent ? event.deltaX : event.deltaY;
            if (!amount) return;
            event.preventDefault();
            routeCarousel.scrollLeft += amount;
        }, { passive: false });

        let guideMapZoom = 1;

        function applyGuideMapZoom() {
            if (googleGuideMap) {
                return;
            }

            guideMapWorld.style.setProperty(
                "--map-zoom",
                guideMapZoom.toFixed(2)
            );
        }

        function changeGuideMapZoom(amount) {
            if (googleGuideMap) {
                const currentZoom =
                    googleGuideMap.getZoom() || 13;

                googleGuideMap.setZoom(
                    Math.min(
                        19,
                        Math.max(
                            11,
                            currentZoom +
                            (amount > 0 ? 1 : -1)
                        )
                    )
                );

                return;
            }

            guideMapZoom = Math.min(
                2.2,
                Math.max(
                    1,
                    guideMapZoom + amount
                )
            );

            applyGuideMapZoom();
        }

        guideMapZoomIn.addEventListener("click", function (event) {
            event.stopPropagation();
            changeGuideMapZoom(0.18);
        });

        guideMapZoomOut.addEventListener("click", function (event) {
            event.stopPropagation();
            changeGuideMapZoom(-0.18);
        });

        guideMapCanvas.addEventListener("wheel", function (event) {
            if (googleGuideMap) {
                // Let Google Maps handle native wheel zoom.
                return;
            }

            event.preventDefault();
            changeGuideMapZoom(
                event.deltaY < 0
                    ? 0.12
                    : -0.12
            );
        }, { passive: false });

        guideMapCanvas.addEventListener("dblclick", function (event) {
            if (googleGuideMap) {
                // Let Google Maps handle native double-click zoom.
                return;
            }

            event.preventDefault();
            changeGuideMapZoom(0.2);
        });

        guideMapExpandButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const expanded = guidePageElement.classList.toggle("map-expanded");
            guideMapExpandButton.setAttribute("aria-label", expanded ? "Collapse map" : "Expand map");
            guideMapExpandButton.title = expanded ? "Collapse map" : "Expand map";
            guideMapExpandIcon.textContent = expanded ? "↙" : "⛶";

            if (googleGuideMap) {
                setTimeout(
                    function () {
                        google.maps.event.trigger(
                            googleGuideMap,
                            "resize"
                        );

                        renderGuideMapRoutes();
                    },
                    260
                );
            }
        });

        applyGuideMapZoom();
        renderDowntownRouteCards();
        renderGuideMapRoutes();
        initializeGoogleGuideMap();

        // ==================================================
        // TRIP GUIDANCE
        // ==================================================

        const tripInstruction =
            get("tripInstruction");

        const tripSubtext =
            get("tripSubtext");

        const nextTripStepButton =
            get("nextTripStepButton");

        const endTripButton =
            get("endTripButton");


        const tripSteps = [

            {
                title:
                    "Walk toward the boarding area",

                text:
                    "Your jeepney is approximately 3 minutes away."
            },

            {
                title:
                    "Your jeepney is approaching",

                text:
                    "Be ready to board your selected route."
            },

            {
                title:
                    "You are now riding",

                text:
                    "LARGA is tracking your progress toward your destination."
            },

            {
                title:
                    "Prepare to get off",

                text:
                    "Your destination is approximately 300 meters away."
            },

            {
                title:
                    "You have arrived",

                text:
                    "Your destination is nearby. Trip completed."
            }

        ];


        let currentTripStep =
            0;


        function resetTripSteps() {

            currentTripStep =
                0;


            tripInstruction.textContent =
                tripSteps[0].title;


            tripSubtext.textContent =
                tripSteps[0].text;


            nextTripStepButton.textContent =
                "Simulate Next Step";


            nextTripStepButton.disabled =
                false;

        }


        nextTripStepButton.addEventListener(
            "click",
            function () {

                if (
                    currentTripStep <
                    tripSteps.length - 1
                ) {

                    currentTripStep++;

                }


                tripInstruction.textContent =
                    tripSteps[
                        currentTripStep
                    ].title;


                tripSubtext.textContent =
                    tripSteps[
                        currentTripStep
                    ].text;


                if (
                    currentTripStep ===
                    tripSteps.length - 1
                ) {

                    nextTripStepButton.textContent =
                        "Trip Complete";


                    nextTripStepButton.disabled =
                        true;

                }

            }
        );


        endTripButton.addEventListener(
            "click",
            function () {

                hide(
                    activeTrip
                );


                show(
                    noActiveTrip
                );


                resetTripSteps();

            }
        );


        const goToGuideButton =
            get("goToGuideButton");


        goToGuideButton.addEventListener(
            "click",
            function () {

                openPage(
                    "guide"
                );

            }
        );



        // ==================================================
        // LIVE TRACKING 5.0
        // ==================================================
        //
        // Live Tracking intentionally simulates vehicle movement for the
        // prototype. Route geometry comes from the same route database used
        // by Guide. The vehicle layer is completely separate from Guide.
        //
        // Only one route can be tracked at a time.

        const liveRouteCarousel =
            get("liveRouteCarousel");

        const liveRouteSearchInput =
            get("liveRouteSearchInput");

        const liveRouteSearchClear =
            get("liveRouteSearchClear");

        const liveRouteSearchResults =
            get("liveRouteSearchResults");

        const liveGoogleMapElement =
            get("liveGoogleMap");

        const liveMapLoading =
            get("liveMapLoading");

        const liveMapRouteDot =
            get("liveMapRouteDot");

        const liveMapRouteName =
            get("liveMapRouteName");

        const liveVehicleCountLabel =
            get("liveVehicleCountLabel");

        const liveLocationButton =
            get("liveLocationButton");

        const liveLocationButtonText =
            get("liveLocationButtonText");

        const liveEnableLocationButton =
            get("liveEnableLocationButton");

        const liveLocationGate =
            get("liveLocationGate");

        const liveNearestSection =
            get("liveNearestSection");

        const liveNearestEta =
            get("liveNearestEta");

        const liveNearestRouteName =
            get("liveNearestRouteName");

        const liveNearestPlate =
            get("liveNearestPlate");

        const liveNearestDistance =
            get("liveNearestDistance");

        const liveNearestRouteIcon =
            get("liveNearestRouteIcon");

        const liveNotifyThreshold =
            get("liveNotifyThreshold");

        const liveNotifyButton =
            get("liveNotifyButton");

        const liveNotifyStatus =
            get("liveNotifyStatus");

        const liveOtherCount =
            get("liveOtherCount");

        const liveVehicleList =
            get("liveVehicleList");

        const largaLiveToast =
            get("largaLiveToast");

        const largaLiveToastTitle =
            get("largaLiveToastTitle");

        const largaLiveToastMessage =
            get("largaLiveToastMessage");


        let liveGoogleMap = null;
        let liveMapInitialized = false;
        let liveMapInitializing = false;

        let liveRouteHalo = null;
        let liveRouteLine = null;

        let liveUserMarker = null;

        let activeLiveRouteId = null;
        let activeLiveRoutePath = [];
        let activeLiveRouteMetrics = null;

        let liveVehicles = [];
        let liveVehicleMarkers = [];

        let selectedLiveVehicleId = null;

        let liveLocationWatchId = null;
        let liveUserCoordinates = null;
        let liveBoardingPoint = null;

        let liveSimulationTimer = null;
        let liveLastTickTime = null;

        let liveNotificationSubscription = null;
        let liveToastTimer = null;

        // Accelerated slightly so the classroom prototype visibly changes
        // without making the markers jump unrealistically.
        const LIVE_SIMULATION_TIME_SCALE = 6;

        const LIVE_ROUTE_CARD_COUNT = 8;


        function liveHash(value) {
            let hash = 2166136261;

            String(value)
                .split("")
                .forEach(function (character) {
                    hash ^= character.charCodeAt(0);

                    hash = Math.imul(
                        hash,
                        16777619
                    );
                });

            return hash >>> 0;
        }


        function getLiveRouteById(routeId) {
            return guideRouteCatalog.find(
                function (route) {
                    return route.id === routeId;
                }
            ) || null;
        }


        function getLiveDefaultRoute() {
            if (
                selectedGuideRoute &&
                getLiveRouteById(
                    selectedGuideRoute.id
                )
            ) {
                return selectedGuideRoute;
            }

            return (
                guideRouteCatalog.find(
                    function (route) {
                        return route.id === "route-1";
                    }
                ) ||
                guideRouteCatalog[0]
            );
        }


        function getLiveVehicleCount(route) {
            return (
                3 +
                (
                    liveHash(route.id) %
                    3
                )
            );
        }


        function getLivePlate(
            route,
            vehicleIndex
        ) {
            const seed =
                liveHash(
                    route.id +
                    "-plate-" +
                    vehicleIndex
                );

            // For-hire motor vehicles use three alphabetic characters
            // followed by four numeric characters under the modern LTO
            // plate series. These values are generated and explicitly
            // labeled SIMULATED in the interface.
            const letters = [];

            for (
                let index = 0;
                index < 3;
                index += 1
            ) {
                const shift =
                    (seed >> (index * 5)) & 31;

                letters.push(
                    String.fromCharCode(
                        65 +
                        (
                            shift %
                            26
                        )
                    )
                );
            }

            const number =
                1000 +
                (
                    (
                        seed +
                        vehicleIndex * 7919
                    ) %
                    9000
                );

            return (
                letters.join("") +
                " " +
                String(number)
            );
        }


        function haversineMeters(
            pointA,
            pointB
        ) {
            const earthRadius =
                6371000;

            const toRadians =
                function (degrees) {
                    return (
                        degrees *
                        Math.PI /
                        180
                    );
                };

            const latitudeOne =
                toRadians(pointA.lat);

            const latitudeTwo =
                toRadians(pointB.lat);

            const latitudeDelta =
                toRadians(
                    pointB.lat -
                    pointA.lat
                );

            const longitudeDelta =
                toRadians(
                    pointB.lng -
                    pointA.lng
                );

            const sinLatitude =
                Math.sin(
                    latitudeDelta / 2
                );

            const sinLongitude =
                Math.sin(
                    longitudeDelta / 2
                );

            const a =
                sinLatitude * sinLatitude +
                Math.cos(latitudeOne) *
                Math.cos(latitudeTwo) *
                sinLongitude *
                sinLongitude;

            return (
                earthRadius *
                2 *
                Math.atan2(
                    Math.sqrt(a),
                    Math.sqrt(1 - a)
                )
            );
        }


        function buildLiveRouteMetrics(path) {
            const cumulative = [0];

            let total = 0;

            for (
                let index = 1;
                index < path.length;
                index += 1
            ) {
                total +=
                    haversineMeters(
                        path[index - 1],
                        path[index]
                    );

                cumulative.push(
                    total
                );
            }

            return {
                cumulative:
                    cumulative,

                total:
                    total
            };
        }


        function sampleLivePathAtDistance(
            path,
            metrics,
            distance
        ) {
            if (
                !path.length ||
                !metrics ||
                metrics.total <= 0
            ) {
                return (
                    path[0] ||
                    DAVAO_MAP_CENTER
                );
            }

            let normalizedDistance =
                distance %
                metrics.total;

            if (
                normalizedDistance < 0
            ) {
                normalizedDistance +=
                    metrics.total;
            }

            let segmentIndex = 1;

            while (
                segmentIndex <
                    metrics.cumulative.length &&
                metrics.cumulative[
                    segmentIndex
                ] <
                    normalizedDistance
            ) {
                segmentIndex += 1;
            }

            if (
                segmentIndex >=
                    path.length
            ) {
                return path[
                    path.length - 1
                ];
            }

            const startIndex =
                segmentIndex - 1;

            const segmentStart =
                metrics.cumulative[
                    startIndex
                ];

            const segmentEnd =
                metrics.cumulative[
                    segmentIndex
                ];

            const segmentLength =
                Math.max(
                    1,
                    segmentEnd -
                    segmentStart
                );

            const progress =
                (
                    normalizedDistance -
                    segmentStart
                ) /
                segmentLength;

            const start =
                path[
                    startIndex
                ];

            const end =
                path[
                    segmentIndex
                ];

            return {
                lat:
                    start.lat +
                    (
                        end.lat -
                        start.lat
                    ) *
                    progress,

                lng:
                    start.lng +
                    (
                        end.lng -
                        start.lng
                    ) *
                    progress
            };
        }


        function findNearestLivePathPoint(
            coordinates,
            path,
            metrics
        ) {
            if (
                !coordinates ||
                !path.length
            ) {
                return null;
            }

            let nearestIndex = 0;
            let nearestDistance =
                Infinity;

            path.forEach(
                function (
                    point,
                    index
                ) {
                    const distance =
                        haversineMeters(
                            coordinates,
                            point
                        );

                    if (
                        distance <
                        nearestDistance
                    ) {
                        nearestDistance =
                            distance;

                        nearestIndex =
                            index;
                    }
                }
            );

            return {
                index:
                    nearestIndex,

                point:
                    path[
                        nearestIndex
                    ],

                walkingDistanceMeters:
                    nearestDistance,

                routeDistance:
                    metrics.cumulative[
                        nearestIndex
                    ] || 0
            };
        }


        function getLiveDistanceAhead(
            vehicleDistance,
            targetDistance,
            totalDistance
        ) {
            let distance =
                targetDistance -
                vehicleDistance;

            if (
                distance < 0
            ) {
                distance +=
                    totalDistance;
            }

            return distance;
        }


        function getLiveVehicleEtaMinutes(
            vehicle
        ) {
            if (
                !liveBoardingPoint ||
                !activeLiveRouteMetrics
            ) {
                return null;
            }

            const distanceAhead =
                getLiveDistanceAhead(
                    vehicle.distanceOnRoute,
                    liveBoardingPoint.routeDistance,
                    activeLiveRouteMetrics.total
                );

            const metersPerMinute =
                (
                    vehicle.speedKph *
                    1000
                ) /
                60;

            return Math.max(
                0.2,
                distanceAhead /
                metersPerMinute
            );
        }


        function formatLiveEta(minutes) {
            if (
                minutes === null ||
                !Number.isFinite(minutes)
            ) {
                return "--";
            }

            if (
                minutes < 1
            ) {
                return "<1";
            }

            return String(
                Math.max(
                    1,
                    Math.round(minutes)
                )
            );
        }


        function formatLiveDistance(meters) {
            if (
                !Number.isFinite(meters)
            ) {
                return "";
            }

            if (
                meters < 1000
            ) {
                return (
                    Math.max(
                        10,
                        Math.round(
                            meters / 10
                        ) * 10
                    ) +
                    " m"
                );
            }

            return (
                (
                    meters /
                    1000
                ).toFixed(1) +
                " km"
            );
        }


        function setLiveRouteCardTheme(
            card,
            route
        ) {
            setCardTheme(
                card,
                route
            );

            card.style.setProperty(
                "--live-route-accent",
                getRouteAccent(route)
            );
        }


        function renderLiveRouteCards() {
            liveRouteCarousel.innerHTML =
                "";

            const rankedRoutes =
                guideRouteCatalog
                    .slice()
                    .sort(
                        function (a, b) {
                            const downtownDifference =
                                Number(Boolean(b.downtown)) -
                                Number(Boolean(a.downtown));

                            if (
                                downtownDifference !== 0
                            ) {
                                return downtownDifference;
                            }

                            return (
                                routeScore(b) -
                                routeScore(a)
                            );
                        }
                    );

            const activeIndex =
                rankedRoutes.findIndex(
                    function (route) {
                        return (
                            route.id ===
                            activeLiveRouteId
                        );
                    }
                );

            if (
                activeIndex >=
                LIVE_ROUTE_CARD_COUNT
            ) {
                const activeRoute =
                    rankedRoutes.splice(
                        activeIndex,
                        1
                    )[0];

                rankedRoutes.unshift(
                    activeRoute
                );
            }

            rankedRoutes
                .slice(
                    0,
                    LIVE_ROUTE_CARD_COUNT
                )
                .forEach(
                    function (route) {
                        const card =
                            document.createElement(
                                "button"
                            );

                        card.type =
                            "button";

                        card.className =
                            "live-route-card";

                        card.dataset.routeId =
                            route.id;

                        if (
                            route.id ===
                            activeLiveRouteId
                        ) {
                            card.classList.add(
                                "is-active"
                            );
                        }

                        setLiveRouteCardTheme(
                            card,
                            route
                        );

                        card.innerHTML = `
                            <span class="live-route-card-kicker">
                                ${route.downtown ? "DOWNTOWN" : "CITY ROUTE"}
                            </span>

                            <strong>
                                ${route.name}
                            </strong>

                            <small>
                                ${route.short}
                            </small>

                            <span class="live-route-card-count">
                                <i></i>
                                ${getLiveVehicleCount(route)} active
                            </span>
                        `;

                        card.addEventListener(
                            "click",
                            function () {
                                selectLiveRoute(
                                    route.id,
                                    {
                                        fitMap:
                                            true,

                                        announce:
                                            true
                                    }
                                );
                            }
                        );

                        liveRouteCarousel.appendChild(
                            card
                        );
                    }
                );
        }


        function updateLiveRouteCardSelection() {
            document
                .querySelectorAll(
                    ".live-route-card"
                )
                .forEach(
                    function (card) {
                        card.classList.toggle(
                            "is-active",
                            card.dataset.routeId ===
                                activeLiveRouteId
                        );
                    }
                );
        }


        function renderLiveRouteSearch() {
            const query =
                normalizeGuideText(
                    liveRouteSearchInput.value
                );

            liveRouteSearchResults.innerHTML =
                "";

            liveRouteSearchClear.classList.toggle(
                "hidden",
                !query
            );

            if (!query) {
                hide(
                    liveRouteSearchResults
                );

                return;
            }

            const matches =
                guideRouteCatalog
                    .filter(
                        function (route) {
                            const haystack =
                                [
                                    route.name,
                                    route.short
                                ]
                                    .concat(
                                        route.landmarks || []
                                    )
                                    .concat(
                                        route.roads || []
                                    )
                                    .join(" ");

                            return normalizeGuideText(
                                haystack
                            ).includes(
                                query
                            );
                        }
                    )
                    .sort(
                        function (a, b) {
                            const downtownDifference =
                                Number(Boolean(b.downtown)) -
                                Number(Boolean(a.downtown));

                            if (
                                downtownDifference !== 0
                            ) {
                                return downtownDifference;
                            }

                            return (
                                routeScore(b) -
                                routeScore(a)
                            );
                        }
                    )
                    .slice(
                        0,
                        8
                    );

            if (
                !matches.length
            ) {
                liveRouteSearchResults.innerHTML = `
                    <div class="live-search-empty">
                        No matching route found.
                    </div>
                `;

                show(
                    liveRouteSearchResults
                );

                return;
            }

            matches.forEach(
                function (route) {
                    const button =
                        document.createElement(
                            "button"
                        );

                    button.type =
                        "button";

                    button.className =
                        "live-search-result";

                    button.innerHTML = `
                        <span
                            class="live-search-result-dot"
                            style="background:${getRouteAccent(route)}"
                        ></span>

                        <span>
                            <strong>${route.name}</strong>
                            <small>${route.short}</small>
                        </span>

                        <em>
                            ${getLiveVehicleCount(route)} live
                        </em>
                    `;

                    button.addEventListener(
                        "click",
                        function () {
                            liveRouteSearchInput.value =
                                route.name;

                            hide(
                                liveRouteSearchResults
                            );

                            selectLiveRoute(
                                route.id,
                                {
                                    fitMap:
                                        true,

                                    announce:
                                        true
                                }
                            );
                        }
                    );

                    liveRouteSearchResults.appendChild(
                        button
                    );
                }
            );

            show(
                liveRouteSearchResults
            );
        }


        function clearLiveMapObjects() {
            if (liveRouteHalo) {
                liveRouteHalo.setMap(
                    null
                );

                liveRouteHalo =
                    null;
            }

            if (liveRouteLine) {
                liveRouteLine.setMap(
                    null
                );

                liveRouteLine =
                    null;
            }

            liveVehicleMarkers.forEach(
                function (record) {
                    if (
                        record.marker
                    ) {
                        record.marker.map =
                            null;
                    }
                }
            );

            liveVehicleMarkers =
                [];

            selectedLiveVehicleId =
                null;
        }


        function createLiveJeepneyMarkerContent(
            vehicle,
            route
        ) {
            const shell =
                document.createElement(
                    "div"
                );

            shell.className =
                "live-jeepney-marker-shell";

            shell.style.setProperty(
                "--live-route-color",
                getRouteAccent(route)
            );

            shell.dataset.vehicleId =
                vehicle.id;

            shell.innerHTML = `
                <button
                    class="live-jeepney-marker-button"
                    type="button"
                    aria-label="${route.name}, simulated jeepney ${vehicle.plate}"
                >
                    <span class="live-jeepney-vehicle">
                        <span class="live-jeep-roof"></span>
                        <span class="live-jeep-window live-jeep-window-one"></span>
                        <span class="live-jeep-window live-jeep-window-two"></span>
                        <span class="live-jeep-grille"></span>
                        <span class="live-jeep-wheel live-jeep-wheel-left"></span>
                        <span class="live-jeep-wheel live-jeep-wheel-right"></span>
                    </span>
                </button>

                <div class="live-jeepney-popover">
                    <div class="live-popover-top">
                        <span class="live-popover-route">
                            ${route.name}
                        </span>

                        <span class="live-popover-simulated">
                            SIMULATED
                        </span>
                    </div>

                    <strong class="live-popover-plate">
                        ${vehicle.plate}
                    </strong>

                    <span class="live-popover-status">
                        Live position on ${route.name}
                    </span>

                    <div class="live-popover-eta">
                        <small>
                            ETA TO YOUR BOARDING POINT
                        </small>

                        <b data-live-marker-eta>
                            Enable location
                        </b>
                    </div>

                    <button
                        class="live-popover-notify"
                        type="button"
                        data-live-marker-notify
                    >
                        ♢ Notify me
                    </button>
                </div>
            `;

            const markerButton =
                shell.querySelector(
                    ".live-jeepney-marker-button"
                );

            markerButton.addEventListener(
                "click",
                function (event) {
                    event.stopPropagation();

                    selectedLiveVehicleId =
                        (
                            selectedLiveVehicleId ===
                                vehicle.id
                        )
                            ? null
                            : vehicle.id;

                    updateLiveMarkerSelection();
                }
            );

            const notifyButton =
                shell.querySelector(
                    "[data-live-marker-notify]"
                );

            notifyButton.addEventListener(
                "click",
                function (event) {
                    event.preventDefault();
                    event.stopPropagation();

                    selectedLiveVehicleId =
                        vehicle.id;

                    updateLiveMarkerSelection();

                    armLiveNotification(
                        vehicle.id
                    );
                }
            );

            return shell;
        }


        function updateLiveMarkerSelection() {
            liveVehicleMarkers.forEach(
                function (record) {
                    const isSelected =
                        record.vehicle.id ===
                        selectedLiveVehicleId;

                    record.content
                        .classList
                        .toggle(
                            "is-selected",
                            isSelected
                        );

                    const etaElement =
                        record.content.querySelector(
                            "[data-live-marker-eta]"
                        );

                    const eta =
                        getLiveVehicleEtaMinutes(
                            record.vehicle
                        );

                    if (
                        etaElement
                    ) {
                        etaElement.textContent =
                            eta === null
                                ? "Enable location"
                                : (
                                    formatLiveEta(eta) +
                                    " min"
                                );
                    }
                }
            );
        }


        function createLiveVehicles(
            route,
            metrics
        ) {
            const count =
                getLiveVehicleCount(
                    route
                );

            const vehicles = [];

            for (
                let index = 0;
                index < count;
                index += 1
            ) {
                const seed =
                    liveHash(
                        route.id +
                        "-vehicle-" +
                        index
                    );

                const spacing =
                    (
                        index +
                        0.14 +
                        (
                            (seed % 23) /
                            100
                        )
                    ) /
                    count;

                const speedKph =
                    16 +
                    (
                        seed %
                        8
                    );

                vehicles.push({
                    id:
                        route.id +
                        "-jeep-" +
                        index,

                    routeId:
                        route.id,

                    plate:
                        getLivePlate(
                            route,
                            index
                        ),

                    speedKph:
                        speedKph,

                    distanceOnRoute:
                        (
                            metrics.total *
                            spacing
                        ) %
                        metrics.total,

                    markerIndex:
                        index
                });
            }

            return vehicles;
        }


        function createLiveVehicleMarkers(
            route
        ) {
            liveVehicleMarkers =
                liveVehicles.map(
                    function (vehicle) {
                        const position =
                            sampleLivePathAtDistance(
                                activeLiveRoutePath,
                                activeLiveRouteMetrics,
                                vehicle.distanceOnRoute
                            );

                        const content =
                            createLiveJeepneyMarkerContent(
                                vehicle,
                                route
                            );

                        const marker =
                            new GoogleAdvancedMarkerElement({
                                map:
                                    liveGoogleMap,

                                position:
                                    position,

                                title:
                                    route.name +
                                    " • " +
                                    vehicle.plate +
                                    " • simulated",

                                zIndex:
                                    50 +
                                    vehicle.markerIndex
                            });

                        marker.append(
                            content
                        );

                        return {
                            vehicle:
                                vehicle,

                            marker:
                                marker,

                            content:
                                content
                        };
                    }
                );
        }


        function fitLiveMapToRoute() {
            if (
                !liveGoogleMap ||
                !activeLiveRoutePath.length ||
                !GoogleLatLngBounds
            ) {
                return;
            }

            const bounds =
                new GoogleLatLngBounds();

            activeLiveRoutePath
                .forEach(
                    function (point) {
                        bounds.extend(
                            point
                        );
                    }
                );

            if (
                liveUserCoordinates
            ) {
                bounds.extend(
                    liveUserCoordinates
                );
            }

            liveGoogleMap.fitBounds(
                bounds,
                54
            );

            google.maps.event
                .addListenerOnce(
                    liveGoogleMap,
                    "idle",
                    function () {
                        if (
                            liveGoogleMap.getZoom() >
                            16
                        ) {
                            liveGoogleMap.setZoom(
                                16
                            );
                        }
                    }
                );
        }


        function drawLiveRoute(
            route,
            path
        ) {
            const accent =
                getRouteAccent(
                    route
                );

            liveRouteHalo =
                new GooglePolyline({
                    map:
                        liveGoogleMap,

                    path:
                        path,

                    strokeColor:
                        "#ffffff",

                    strokeOpacity:
                        0.90,

                    strokeWeight:
                        9,

                    clickable:
                        false,

                    zIndex:
                        8
                });

            liveRouteLine =
                new GooglePolyline({
                    map:
                        liveGoogleMap,

                    path:
                        path,

                    strokeColor:
                        accent,

                    strokeOpacity:
                        0.96,

                    strokeWeight:
                        6,

                    clickable:
                        false,

                    zIndex:
                        9
                });
        }


        async function initializeLiveTrackingMap() {
            if (
                liveMapInitialized ||
                liveMapInitializing
            ) {
                if (
                    liveGoogleMap
                ) {
                    requestAnimationFrame(
                        function () {
                            google.maps.event.trigger(
                                liveGoogleMap,
                                "resize"
                            );

                            if (
                                activeLiveRoutePath.length
                            ) {
                                fitLiveMapToRoute();
                            }
                        }
                    );
                }

                return;
            }

            liveMapInitializing =
                true;

            show(
                liveMapLoading
            );

            await loadGoogleMapsDemoKey();

            if (
                !hasGoogleMapsDemoKey()
            ) {
                liveMapInitializing =
                    false;

                liveMapLoading.innerHTML = `
                    <strong>Google Maps Demo Key needed</strong>
                    <small>Add the key to maps-demo-key.txt.</small>
                `;

                return;
            }

            try {
                await loadGoogleMapsScript();

                const [
                    mapsLibrary,
                    markerLibrary,
                    coreLibrary
                ] =
                    await Promise.all([
                        google.maps.importLibrary(
                            "maps"
                        ),
                        google.maps.importLibrary(
                            "marker"
                        ),
                        google.maps.importLibrary(
                            "core"
                        )
                    ]);

                GooglePolyline =
                    GooglePolyline ||
                    mapsLibrary.Polyline;

                GoogleAdvancedMarkerElement =
                    GoogleAdvancedMarkerElement ||
                    markerLibrary.AdvancedMarkerElement;

                GoogleLatLngBounds =
                    GoogleLatLngBounds ||
                    coreLibrary.LatLngBounds;

                liveGoogleMap =
                    new mapsLibrary.Map(
                        liveGoogleMapElement,
                        {
                            center:
                                DAVAO_MAP_CENTER,

                            zoom:
                                13,

                            mapId:
                                LARGA_GOOGLE_MAPS_CONFIG.mapId ||
                                "DEMO_MAP_ID",

                            disableDefaultUI:
                                true,

                            streetViewControl:
                                false,

                            mapTypeControl:
                                false,

                            fullscreenControl:
                                false,

                            zoomControl:
                                true,

                            clickableIcons:
                                true,

                            gestureHandling:
                                "greedy"
                        }
                    );

                liveGoogleMap.addListener(
                    "click",
                    function () {
                        selectedLiveVehicleId =
                            null;

                        updateLiveMarkerSelection();
                    }
                );

                liveMapInitialized =
                    true;

                liveMapInitializing =
                    false;

                hide(
                    liveMapLoading
                );

                if (
                    activeLiveRouteId
                ) {
                    await loadLiveRouteOnMap(
                        activeLiveRouteId,
                        {
                            fitMap:
                                true
                        }
                    );
                }
            }
            catch (error) {
                liveMapInitializing =
                    false;

                console.error(
                    "Live map initialization failed:",
                    error
                );

                liveMapLoading.innerHTML = `
                    <strong>Live map could not load</strong>
                    <small>Check the Demo Key and browser console.</small>
                `;
            }
        }


        async function loadLiveRouteOnMap(
            routeId,
            options
        ) {
            const route =
                getLiveRouteById(
                    routeId
                );

            if (
                !route ||
                !liveGoogleMap
            ) {
                return;
            }

            show(
                liveMapLoading
            );

            clearLiveMapObjects();

            try {
                const path =
                    await computeGoogleRoutePath(
                        route
                    );

                if (
                    activeLiveRouteId !==
                    routeId
                ) {
                    return;
                }

                activeLiveRoutePath =
                    path.slice();

                activeLiveRouteMetrics =
                    buildLiveRouteMetrics(
                        path
                    );

                drawLiveRoute(
                    route,
                    path
                );

                liveVehicles =
                    createLiveVehicles(
                        route,
                        activeLiveRouteMetrics
                    );

                createLiveVehicleMarkers(
                    route
                );

                liveVehicleCountLabel.textContent =
                    liveVehicles.length +
                    " simulated jeepney" +
                    (
                        liveVehicles.length === 1
                            ? ""
                            : "s"
                    );

                if (
                    liveUserCoordinates
                ) {
                    updateLiveBoardingPoint();
                }

                updateLiveTrackingPanels();

                if (
                    !options ||
                    options.fitMap !== false
                ) {
                    fitLiveMapToRoute();
                }

                startLiveSimulation();
            }
            catch (error) {
                console.error(
                    "Could not load Live route:",
                    error
                );

                liveVehicleCountLabel.textContent =
                    "Route unavailable";

                liveMapLoading.innerHTML = `
                    <strong>Route could not be displayed</strong>
                    <small>Route geometry is still being refined.</small>
                `;

                return;
            }

            hide(
                liveMapLoading
            );
        }


        async function selectLiveRoute(
            routeId,
            options
        ) {
            const route =
                getLiveRouteById(
                    routeId
                );

            if (!route) {
                return;
            }

            activeLiveRouteId =
                route.id;

            liveNotificationSubscription =
                null;

            liveNotifyStatus.textContent =
                "Choose an alert time for this jeepney.";

            liveNotifyButton.classList.remove(
                "is-armed"
            );

            liveMapRouteName.textContent =
                route.name;

            liveMapRouteDot.style.background =
                getRouteAccent(
                    route
                );

            liveNearestRouteIcon.style.setProperty(
                "--nearest-route-color",
                getRouteAccent(route)
            );

            updateLiveRouteCardSelection();

            if (
                options &&
                options.announce
            ) {
                liveRouteSearchInput.value =
                    route.name;

                hide(
                    liveRouteSearchResults
                );
            }

            if (
                liveMapInitialized
            ) {
                await loadLiveRouteOnMap(
                    route.id,
                    options || {}
                );
            }
        }


        function createLiveUserMarker() {
            if (
                !liveGoogleMap ||
                !GoogleAdvancedMarkerElement ||
                !liveUserCoordinates
            ) {
                return;
            }

            if (
                liveUserMarker
            ) {
                liveUserMarker.position =
                    liveUserCoordinates;

                liveUserMarker.map =
                    liveGoogleMap;

                return;
            }

            const element =
                document.createElement(
                    "div"
                );

            element.className =
                "live-user-marker";

            element.innerHTML =
                "<span></span>";

            liveUserMarker =
                new GoogleAdvancedMarkerElement({
                    map:
                        liveGoogleMap,

                    position:
                        liveUserCoordinates,

                    title:
                        "Your location",

                    zIndex:
                        150
                });

            liveUserMarker.append(
                element
            );
        }


        function updateLiveBoardingPoint() {
            if (
                !liveUserCoordinates ||
                !activeLiveRoutePath.length ||
                !activeLiveRouteMetrics
            ) {
                liveBoardingPoint =
                    null;

                return;
            }

            liveBoardingPoint =
                findNearestLivePathPoint(
                    liveUserCoordinates,
                    activeLiveRoutePath,
                    activeLiveRouteMetrics
                );

            createLiveUserMarker();

            updateLiveTrackingPanels();
        }


        function requestLiveLocation() {
            if (
                !navigator.geolocation
            ) {
                showLiveToast(
                    "Location unavailable",
                    "This browser does not support geolocation."
                );

                return;
            }

            liveLocationButton.disabled =
                true;

            liveEnableLocationButton.disabled =
                true;

            liveLocationButtonText.textContent =
                "Locating…";

            const onPosition =
                function (position) {
                    liveUserCoordinates = {
                        lat:
                            position.coords.latitude,

                        lng:
                            position.coords.longitude
                    };

                    liveLocationButton.disabled =
                        false;

                    liveEnableLocationButton.disabled =
                        false;

                    liveLocationButton.classList.add(
                        "is-active"
                    );

                    liveLocationButtonText.textContent =
                        "Location active";

                    hide(
                        liveLocationGate
                    );

                    show(
                        liveNearestSection
                    );

                    updateLiveBoardingPoint();

                    if (
                        liveGoogleMap &&
                        activeLiveRoutePath.length
                    ) {
                        fitLiveMapToRoute();
                    }
                };

            const onError =
                function () {
                    liveLocationButton.disabled =
                        false;

                    liveEnableLocationButton.disabled =
                        false;

                    liveLocationButtonText.textContent =
                        "Enable location";

                    showLiveToast(
                        "Location permission needed",
                        "Allow location access to calculate the nearest jeepney and ETA."
                    );
                };

            if (
                liveLocationWatchId !==
                null
            ) {
                navigator.geolocation.clearWatch(
                    liveLocationWatchId
                );
            }

            liveLocationWatchId =
                navigator.geolocation.watchPosition(
                    onPosition,
                    onError,
                    {
                        enableHighAccuracy:
                            true,

                        maximumAge:
                            8000,

                        timeout:
                            15000
                    }
                );
        }


        function getSortedLiveVehiclesByEta() {
            return liveVehicles
                .map(
                    function (vehicle) {
                        return {
                            vehicle:
                                vehicle,

                            eta:
                                getLiveVehicleEtaMinutes(
                                    vehicle
                                )
                        };
                    }
                )
                .filter(
                    function (record) {
                        return (
                            record.eta !==
                            null
                        );
                    }
                )
                .sort(
                    function (a, b) {
                        return (
                            a.eta -
                            b.eta
                        );
                    }
                );
        }


        function renderLiveVehicleList(
            sortedVehicles
        ) {
            liveVehicleList.innerHTML =
                "";

            const remaining =
                sortedVehicles.slice(
                    1
                );

            liveOtherCount.textContent =
                remaining.length +
                " vehicle" +
                (
                    remaining.length === 1
                        ? ""
                        : "s"
                );

            remaining.forEach(
                function (record) {
                    const row =
                        document.createElement(
                            "button"
                        );

                    row.type =
                        "button";

                    row.className =
                        "live-vehicle-row";

                    row.innerHTML = `
                        <span
                            class="live-list-jeep"
                            aria-hidden="true"
                        >
                            <span></span>
                        </span>

                        <span class="live-list-copy">
                            <strong>${record.vehicle.plate}</strong>
                            <small>SIMULATED • ${record.vehicle.speedKph} km/h</small>
                        </span>

                        <span class="live-list-eta">
                            ${formatLiveEta(record.eta)}
                            <small>min</small>
                        </span>
                    `;

                    row.addEventListener(
                        "click",
                        function () {
                            selectedLiveVehicleId =
                                record.vehicle.id;

                            updateLiveMarkerSelection();

                            const markerRecord =
                                liveVehicleMarkers.find(
                                    function (candidate) {
                                        return (
                                            candidate.vehicle.id ===
                                            record.vehicle.id
                                        );
                                    }
                                );

                            if (
                                markerRecord &&
                                liveGoogleMap
                            ) {
                                liveGoogleMap.panTo(
                                    markerRecord.marker.position
                                );
                            }
                        }
                    );

                    liveVehicleList.appendChild(
                        row
                    );
                }
            );
        }


        function updateLiveTrackingPanels() {
            updateLiveMarkerSelection();

            if (
                !liveUserCoordinates ||
                !liveBoardingPoint
            ) {
                return;
            }

            const route =
                getLiveRouteById(
                    activeLiveRouteId
                );

            const sorted =
                getSortedLiveVehiclesByEta();

            if (
                !route ||
                !sorted.length
            ) {
                return;
            }

            const nearest =
                sorted[0];

            liveNearestEta.textContent =
                formatLiveEta(
                    nearest.eta
                ) +
                " min";

            liveNearestRouteName.textContent =
                route.name;

            liveNearestPlate.textContent =
                nearest.vehicle.plate;

            liveNearestDistance.textContent =
                (
                    "Nearest boarding point is about " +
                    formatLiveDistance(
                        liveBoardingPoint.walkingDistanceMeters
                    ) +
                    " from your location."
                );

            renderLiveVehicleList(
                sorted
            );

            if (
                liveNotificationSubscription &&
                liveNotificationSubscription.vehicleId ===
                    nearest.vehicle.id
            ) {
                liveNotifyButton.classList.add(
                    "is-armed"
                );
            }
            else {
                liveNotifyButton.classList.remove(
                    "is-armed"
                );
            }

            checkLiveNotification(
                sorted
            );
        }


        function showLiveToast(
            title,
            message
        ) {
            largaLiveToastTitle.textContent =
                title;

            largaLiveToastMessage.textContent =
                message;

            show(
                largaLiveToast
            );

            largaLiveToast.classList.add(
                "is-visible"
            );

            if (
                liveToastTimer
            ) {
                clearTimeout(
                    liveToastTimer
                );
            }

            liveToastTimer =
                setTimeout(
                    function () {
                        largaLiveToast.classList.remove(
                            "is-visible"
                        );

                        setTimeout(
                            function () {
                                hide(
                                    largaLiveToast
                                );
                            },
                            220
                        );
                    },
                    4400
                );
        }


        async function requestLiveNotificationPermission() {
            if (
                !("Notification" in window)
            ) {
                return "unsupported";
            }

            if (
                Notification.permission ===
                "granted"
            ) {
                return "granted";
            }

            if (
                Notification.permission ===
                "denied"
            ) {
                return "denied";
            }

            try {
                return await Notification
                    .requestPermission();
            }
            catch (error) {
                return "unsupported";
            }
        }


        async function armLiveNotification(
            vehicleId
        ) {
            if (
                !liveUserCoordinates
            ) {
                showLiveToast(
                    "Enable location first",
                    "LARGA needs your location before an arrival alert can be set."
                );

                return;
            }

            const sorted =
                getSortedLiveVehiclesByEta();

            const chosenRecord =
                sorted.find(
                    function (record) {
                        return (
                            record.vehicle.id ===
                            vehicleId
                        );
                    }
                ) ||
                sorted[0];

            if (!chosenRecord) {
                return;
            }

            const threshold =
                Number(
                    liveNotifyThreshold.value
                );

            const permission =
                await requestLiveNotificationPermission();

            liveNotificationSubscription = {
                vehicleId:
                    chosenRecord.vehicle.id,

                plate:
                    chosenRecord.vehicle.plate,

                threshold:
                    threshold,

                notified:
                    false,

                notificationPermission:
                    permission
            };

            liveNotifyButton.classList.add(
                "is-armed"
            );

            liveNotifyStatus.textContent =
                (
                    "Alert set for " +
                    threshold +
                    " minute" +
                    (
                        threshold === 1
                            ? ""
                            : "s"
                    ) +
                    " before arrival."
                );

            showLiveToast(
                "Arrival alert set",
                chosenRecord.vehicle.plate +
                " will alert you at " +
                threshold +
                " min."
            );

            checkLiveNotification(
                sorted
            );
        }


        function checkLiveNotification(
            sortedVehicles
        ) {
            if (
                !liveNotificationSubscription ||
                liveNotificationSubscription.notified
            ) {
                return;
            }

            const record =
                sortedVehicles.find(
                    function (candidate) {
                        return (
                            candidate.vehicle.id ===
                            liveNotificationSubscription.vehicleId
                        );
                    }
                );

            if (!record) {
                return;
            }

            if (
                record.eta >
                liveNotificationSubscription.threshold
            ) {
                return;
            }

            liveNotificationSubscription.notified =
                true;

            const route =
                getLiveRouteById(
                    activeLiveRouteId
                );

            const etaText =
                formatLiveEta(
                    record.eta
                );

            const message =
                (
                    record.vehicle.plate +
                    " on " +
                    route.name +
                    " is about " +
                    etaText +
                    " min from your boarding point."
                );

            liveNotifyStatus.textContent =
                "Get ready to board your ride.";

            showLiveToast(
                "Get ready to board",
                message
            );

            if (
                liveNotificationSubscription
                    .notificationPermission ===
                    "granted" &&
                "Notification" in window
            ) {
                try {
                    new Notification(
                        "LARGA • Get ready to board",
                        {
                            body:
                                message,

                            tag:
                                "larga-" +
                                record.vehicle.id
                        }
                    );
                }
                catch (error) {
                    console.warn(
                        "Browser notification could not be shown:",
                        error
                    );
                }
            }
        }


        function tickLiveSimulation() {
            if (
                !activeLiveRouteMetrics ||
                !liveVehicles.length
            ) {
                return;
            }

            const now =
                performance.now();

            if (
                liveLastTickTime ===
                null
            ) {
                liveLastTickTime =
                    now;

                return;
            }

            const elapsedSeconds =
                Math.min(
                    2,
                    (
                        now -
                        liveLastTickTime
                    ) /
                    1000
                );

            liveLastTickTime =
                now;

            liveVehicles.forEach(
                function (vehicle) {
                    const metersPerSecond =
                        (
                            vehicle.speedKph *
                            1000 /
                            3600
                        ) *
                        LIVE_SIMULATION_TIME_SCALE;

                    vehicle.distanceOnRoute =
                        (
                            vehicle.distanceOnRoute +
                            metersPerSecond *
                            elapsedSeconds
                        ) %
                        activeLiveRouteMetrics.total;
                }
            );

            liveVehicleMarkers.forEach(
                function (record) {
                    record.marker.position =
                        sampleLivePathAtDistance(
                            activeLiveRoutePath,
                            activeLiveRouteMetrics,
                            record.vehicle.distanceOnRoute
                        );
                }
            );

            updateLiveTrackingPanels();
        }


        function startLiveSimulation() {
            if (
                liveSimulationTimer
            ) {
                clearInterval(
                    liveSimulationTimer
                );
            }

            liveLastTickTime =
                performance.now();

            liveSimulationTimer =
                setInterval(
                    tickLiveSimulation,
                    1000
                );
        }


        async function initializeLiveTrackingPage() {
            if (
                !activeLiveRouteId
            ) {
                const defaultRoute =
                    getLiveDefaultRoute();

                if (
                    defaultRoute
                ) {
                    activeLiveRouteId =
                        defaultRoute.id;
                }
            }

            renderLiveRouteCards();

            const activeRoute =
                getLiveRouteById(
                    activeLiveRouteId
                );

            if (
                activeRoute
            ) {
                liveMapRouteName.textContent =
                    activeRoute.name;

                liveMapRouteDot.style.background =
                    getRouteAccent(
                        activeRoute
                    );

                liveNearestRouteIcon.style.setProperty(
                    "--nearest-route-color",
                    getRouteAccent(activeRoute)
                );
            }

            await initializeLiveTrackingMap();

            if (
                liveMapInitialized &&
                activeLiveRouteId &&
                !activeLiveRoutePath.length
            ) {
                await loadLiveRouteOnMap(
                    activeLiveRouteId,
                    {
                        fitMap:
                            true
                    }
                );
            }
        }


        liveRouteSearchInput.addEventListener(
            "input",
            renderLiveRouteSearch
        );


        liveRouteSearchInput.addEventListener(
            "focus",
            function () {
                if (
                    liveRouteSearchInput.value.trim()
                ) {
                    renderLiveRouteSearch();
                }
            }
        );


        liveRouteSearchClear.addEventListener(
            "click",
            function () {
                liveRouteSearchInput.value =
                    "";

                hide(
                    liveRouteSearchClear
                );

                hide(
                    liveRouteSearchResults
                );

                liveRouteSearchInput.focus();
            }
        );


        document.addEventListener(
            "click",
            function (event) {
                if (
                    !event.target.closest(
                        ".live-search-wrap"
                    )
                ) {
                    hide(
                        liveRouteSearchResults
                    );
                }
            }
        );


        liveLocationButton.addEventListener(
            "click",
            requestLiveLocation
        );


        liveEnableLocationButton.addEventListener(
            "click",
            requestLiveLocation
        );


        liveNotifyButton.addEventListener(
            "click",
            function () {
                const sorted =
                    getSortedLiveVehiclesByEta();

                if (
                    !sorted.length
                ) {
                    showLiveToast(
                        "No ETA yet",
                        "Enable location and wait for the selected route to finish loading."
                    );

                    return;
                }

                armLiveNotification(
                    sorted[0].vehicle.id
                );
            }
        );


        liveNotifyThreshold.addEventListener(
            "change",
            function () {
                if (
                    liveNotificationSubscription
                ) {
                    const sorted =
                        getSortedLiveVehiclesByEta();

                    if (
                        sorted.length
                    ) {
                        armLiveNotification(
                            sorted[0].vehicle.id
                        );
                    }
                }
            }
        );


        // ==================================================
        // SAVED ROUTES
        // ==================================================

        const savedRoutesContainer =
            get(
                "savedRoutesContainer"
            );


        const savedRoutes =
            [];


        saveCurrentRouteButton.addEventListener(
            "click",
            function () {

                if (
                    !selectedGuideRoute
                ) {

                    saveMessage.textContent =
                        "Select a route first.";

                    return;

                }


                const destination =
                    destinationInput
                        .value
                        .trim();


                const route =
                    routeName.textContent;


                const alreadySaved =
                    savedRoutes.some(
                        function (
                            item
                        ) {

                            return (

                                item.route ===
                                route &&

                                item.destination ===
                                destination

                            );

                        }
                    );


                if (
                    alreadySaved
                ) {

                    saveMessage.textContent =
                        "This route is already saved.";


                    return;

                }


                savedRoutes.push(
                    {

                        route:
                            route,

                        destination:
                            destination

                    }
                );


                renderSavedRoutes();


                saveCurrentRouteButton.textContent =
                    "✓ Route Saved";


                if (
                    isGuest
                ) {

                    saveMessage.textContent =
                        "Saved for this session. Sign in for permanent saving.";

                }

                else {

                    saveMessage.textContent =
                        "Route saved.";

                }

            }
        );


        function renderSavedRoutes() {

            savedRoutesContainer.innerHTML =
                "";


            if (
                savedRoutes.length === 0
            ) {

                savedRoutesContainer.innerHTML =
                    `
                    <div class="empty-saved">
                        You haven't saved any routes yet.
                    </div>
                    `;


                return;

            }


            savedRoutes.forEach(
                function (
                    item
                ) {

                    const routeItem =
                        document.createElement(
                            "div"
                        );


                    routeItem.className =
                        "saved-route-item";


                    routeItem.innerHTML =
                        `
                        <div>

                            <strong>
                                ${item.route}
                            </strong>

                            <p>
                                ${item.destination}
                            </p>

                        </div>

                        <span>
                            ★
                        </span>
                        `;


                    savedRoutesContainer
                        .appendChild(
                            routeItem
                        );

                }
            );

        }



        // ==================================================
        // INITIAL STATE
        // ==================================================

        hide(
            roleScreen
        );

        hide(
            loadingScreen
        );

        hide(
            authScreen
        );

        hide(
            driverScreen
        );

        hide(
            mainApp
        );


        hide(
            socialMockOverlay
        );


        show(
            onboardingScreen
        );


        initializeOnboarding();


        openPage(
            "guide"
        );


        console.log(
            "LARGA loaded successfully."
        );

    }
);