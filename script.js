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

            if (
                isGuest
            ) {

                profileButton.textContent =
                    "G";


                return;

            }


            profileButton.textContent =
                currentUserName
                    .charAt(0)
                    .toUpperCase();

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

        function renderGuideMapRoutes() {
            guideRouteLayers.innerHTML = "";
            guideMapStops.innerHTML = "";
            guideMapJeeps.innerHTML = "";
            guideMapJourneyMarkers.innerHTML = "";

            const selectedRoutes = Array.from(selectedGuideRouteIds)
                .map(getRouteById)
                .filter(Boolean);

            if (selectedRoutes.length === 0) {
                guideMapEyebrow.textContent = "MAP PREVIEW";
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
                guideMapEyebrow.textContent = "MAP PREVIEW";
                guideMapRouteName.textContent = selectedRoutes[0].name;
                guideMapRouteDot.style.background = getRouteAccent(selectedRoutes[0]);
            }
            else {
                guideMapEyebrow.textContent = "COMPARING ROUTES";
                guideMapRouteName.textContent = `${selectedRoutes.length} routes selected`;
                guideMapRouteDot.style.background = "var(--larga-orange)";
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

                const positions = getRouteJeeps(route);
                const jeepCount = selectedRoutes.length === 1 ? Math.min(2, positions.length) : 1;

                positions.slice(0, jeepCount).forEach(function (position, jeepIndex) {
                    const jeep = document.createElement("span");
                    jeep.className = "guide-live-jeep";
                    if (dimmed) jeep.classList.add("dimmed-map-object");
                    jeep.textContent = "🚐";
                    jeep.style.left = position[0] + "%";
                    jeep.style.top = position[1] + "%";
                    jeep.style.setProperty("--route-color", accent);
                    jeep.style.animationDelay = `${jeepIndex * 0.1}s`;
                    guideMapJeeps.appendChild(jeep);
                });

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

            function finishRestore() {
                // At this point the floating card already has the exact size
                // and screen position of its placeholder. Moving the same DOM
                // node back into the carousel therefore creates no visual jump.
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

                routeDetailGlass.getAnimations().forEach(function (activeAnimation) {
                    activeAnimation.cancel();
                });

                routeDetailBackdrop.getAnimations().forEach(function (activeAnimation) {
                    activeAnimation.cancel();
                });

                routeDetailGlass.style.removeProperty("opacity");

                routeDetailOverlay.classList.remove("is-open", "card-morph-open");
                routeDetailOverlay.setAttribute("aria-hidden", "true");

                expandedRouteCardState = null;
                routeDetailAnimating = false;
            }

            if (immediate) {
                finishRestore();
                return;
            }

            const overlayRect = routeDetailOverlay.getBoundingClientRect();
            const currentRect = card.getBoundingClientRect();
            const placeholderRect = placeholder.getBoundingClientRect();

            // Convert both rectangles to the overlay's coordinate system.
            // Using real left/top/width/height values avoids the scale/transform
            // mismatch that previously made the card dip downward before it
            // snapped back into the carousel.
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

            // Fade the detailed contents while the card is already moving.
            // No delayed mini-card state is used; that was the source of the
            // small floating card seen near the bottom of the blurred screen.
            routeDetailGlass.animate(
                [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                {
                    duration: 180,
                    easing: "cubic-bezier(0.4, 0, 1, 1)",
                    fill: "forwards"
                }
            );

            // Fade the blurred background at the same time as the card returns.
            routeDetailBackdrop.animate(
                [
                    { opacity: 1 },
                    { opacity: 0 }
                ],
                {
                    duration: 340,
                    easing: "cubic-bezier(0.22, 1, 0.36, 1)",
                    fill: "forwards"
                }
            );

            // Set the underlying geometry to the final destination BEFORE the
            // animation. The keyframes visually interpolate from the expanded
            // box to these values, and when the effect ends there is nothing
            // left to snap or reflow.
            card.style.left = target.left + "px";
            card.style.top = target.top + "px";
            card.style.width = target.width + "px";
            card.style.minWidth = target.width + "px";
            card.style.height = target.height + "px";

            const closingAnimation = card.animate(
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

        function getGuidePlaces() {
            const values = [];
            guideRouteCatalog.forEach(function (route) {
                route.landmarks.forEach(function (landmark) {
                    values.push(landmark);
                });
            });
            return Array.from(new Set(values)).sort(function (a, b) {
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

        function renderGuidePlaceResults(input) {
            activeGuidePlaceInput = input;

            const query = normalizeGuideText(input.value);
            guidePlaceResults.innerHTML = "";

            if (input === tripFromInput) {
                const currentLocationButton = document.createElement("button");
                currentLocationButton.type = "button";
                currentLocationButton.className = "guide-place-result guide-current-location-result";
                currentLocationButton.innerHTML = `
                    <span class="guide-place-icon">⌖</span>
                    <span class="guide-place-copy">
                        <strong>Use my current location</strong>
                        <small>Use this device's GPS position</small>
                    </span>
                    <span class="guide-place-chevron">›</span>
                `;
                currentLocationButton.addEventListener("click", function () {
                    requestPlannerCurrentLocation();
                });
                guidePlaceResults.appendChild(currentLocationButton);
            }

            const matches = guidePlaces
                .filter(function (place) {
                    if (!query) return true;
                    return normalizeGuideText(place).includes(query);
                })
                .slice(0, 9);

            matches.forEach(function (place) {
                const result = document.createElement("button");
                result.type = "button";
                result.className = "guide-place-result";
                result.setAttribute("role", "option");
                result.innerHTML = `
                    <span class="guide-place-icon">⌖</span>
                    <span class="guide-place-copy">
                        <strong>${place}</strong>
                        <small>Supported route landmark</small>
                    </span>
                    <span class="guide-place-chevron">›</span>
                `;
                result.addEventListener("click", function () {
                    setGuidePlaceValue(input, place);
                });
                guidePlaceResults.appendChild(result);
            });

            if (!matches.length && input !== tripFromInput) {
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
            guideMessage.textContent = "Requesting your current location...";
            guideLocationText.textContent = "Locating...";

            if (!navigator.geolocation) {
                guideMessage.textContent = "Your browser does not support location.";
                guideLocationText.textContent = "My location";
                return;
            }

            navigator.geolocation.getCurrentPosition(
                function (position) {
                    plannerCurrentLocationSelected = true;
                    plannerCurrentLocationCoordinates = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };
                    tripFromInput.value = CURRENT_LOCATION_VALUE;
                    show(guideUserMarker);
                    guideLocationText.textContent = "Location active";
                    guideMessage.textContent = "Current location selected. For this prototype, choose a nearby supported landmark if you want route matching before Google Maps is connected.";
                    console.log("Planner location:", position.coords.latitude, position.coords.longitude);
                },
                function () {
                    plannerCurrentLocationSelected = false;
                    plannerCurrentLocationCoordinates = null;
                    tripFromInput.value = "";
                    guideLocationText.textContent = "My location";
                    guideMessage.textContent = "Location permission was not granted.";
                }
            );
        }

        [tripFromInput, tripToInput].forEach(function (input) {
            input.addEventListener("focus", function () {
                renderGuidePlaceResults(input);
            });

            input.addEventListener("input", function () {
                if (input === tripFromInput && input.value !== CURRENT_LOCATION_VALUE) {
                    plannerCurrentLocationSelected = false;
                }
                renderGuidePlaceResults(input);
            });
        });

        document.addEventListener("click", function (event) {
            if (
                !event.target.closest(".guide-trip-planner") &&
                !guidePlaceResults.classList.contains("hidden")
            ) {
                closeGuidePlaceResults();
            }
        });

        function resolveGuidePlace(input) {
            const normalizedInput = normalizeGuideText(input);
            if (!normalizedInput) return null;

            const exact = guidePlaces.find(function (place) {
                return normalizeGuideText(place) === normalizedInput;
            });
            if (exact) return exact;

            return guidePlaces.find(function (place) {
                const candidate = normalizeGuideText(place);
                return candidate.includes(normalizedInput) || normalizedInput.includes(candidate);
            }) || null;
        }

        function routeHasLandmark(route, landmark) {
            const target = normalizeGuideText(landmark);
            return route.landmarks.some(function (item) {
                return normalizeGuideText(item) === target;
            });
        }

        function sharedLandmarks(routeA, routeB, excluded) {
            const exclusions = (excluded || []).map(normalizeGuideText);
            return routeA.landmarks.filter(function (landmark) {
                const normalized = normalizeGuideText(landmark);
                return !exclusions.includes(normalized) && routeB.landmarks.some(function (other) {
                    return normalizeGuideText(other) === normalized;
                });
            });
        }

        function routeScore(route) {
            let score = route.downtown ? 5 : 0;
            if (route.frequency === "Common") score += 3;
            if (route.frequency === "Limited") score -= 4;
            return score;
        }

        function findGuideTripPlan(startInput, endInput) {
            const start = resolveGuidePlace(startInput);
            const end = resolveGuidePlace(endInput);

            if (!start || !end) {
                return {
                    error: "Choose places from the supported landmark suggestions so LARGA can match verified prototype routes."
                };
            }

            if (normalizeGuideText(start) === normalizeGuideText(end)) {
                return { error: "Starting point and destination must be different places." };
            }

            const startingRoutes = guideRouteCatalog
                .filter(function (route) { return routeHasLandmark(route, start); })
                .sort(function (a, b) { return routeScore(b) - routeScore(a); });

            const endingRoutes = guideRouteCatalog
                .filter(function (route) { return routeHasLandmark(route, end); })
                .sort(function (a, b) { return routeScore(b) - routeScore(a); });

            for (const route of startingRoutes) {
                if (routeHasLandmark(route, end)) {
                    return {
                        start,
                        end,
                        transfers: [],
                        legs: [{ route, board: start, alight: end }]
                    };
                }
            }

            let bestTwo = null;
            for (const first of startingRoutes) {
                for (const second of endingRoutes) {
                    if (first.id === second.id) continue;
                    const transfer = sharedLandmarks(first, second, [start, end])[0];
                    if (!transfer) continue;
                    const score = routeScore(first) + routeScore(second);
                    if (!bestTwo || score > bestTwo.score) {
                        bestTwo = { first, second, transfer, score };
                    }
                }
            }

            if (bestTwo) {
                return {
                    start,
                    end,
                    transfers: [bestTwo.transfer],
                    legs: [
                        { route: bestTwo.first, board: start, alight: bestTwo.transfer },
                        { route: bestTwo.second, board: bestTwo.transfer, alight: end }
                    ]
                };
            }

            let bestThree = null;
            for (const first of startingRoutes) {
                for (const middle of guideRouteCatalog) {
                    if (middle.id === first.id) continue;
                    const transferOne = sharedLandmarks(first, middle, [start, end])[0];
                    if (!transferOne) continue;

                    for (const third of endingRoutes) {
                        if (third.id === first.id || third.id === middle.id) continue;
                        const transferTwo = sharedLandmarks(middle, third, [start, end, transferOne])[0];
                        if (!transferTwo) continue;

                        const score = routeScore(first) + routeScore(middle) + routeScore(third);
                        if (!bestThree || score > bestThree.score) {
                            bestThree = {
                                first,
                                middle,
                                third,
                                transferOne,
                                transferTwo,
                                score
                            };
                        }
                    }
                }
            }

            if (bestThree) {
                return {
                    start,
                    end,
                    transfers: [bestThree.transferOne, bestThree.transferTwo],
                    legs: [
                        { route: bestThree.first, board: start, alight: bestThree.transferOne },
                        { route: bestThree.middle, board: bestThree.transferOne, alight: bestThree.transferTwo },
                        { route: bestThree.third, board: bestThree.transferTwo, alight: end }
                    ]
                };
            }

            return {
                error: "No 1-to-3 ride connection was found in the current prototype route catalog for those two landmarks."
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
            guideMessage.textContent = "Tap a ride card to focus that leg. All trip routes remain visible on the map.";
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
                guideMessage.textContent = "Choose a starting point and destination. LARGA will look for up to three jeepney rides.";
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
                    show(guideUserMarker);
                    guideLocationText.textContent = "Location active";
                    guideMessage.textContent = "Current location enabled for the prototype map.";
                    console.log("Guide location:", position.coords.latitude, position.coords.longitude);
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
            guideMapWorld.style.setProperty("--map-zoom", guideMapZoom.toFixed(2));
        }

        function changeGuideMapZoom(amount) {
            guideMapZoom = Math.min(2.2, Math.max(1, guideMapZoom + amount));
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
            event.preventDefault();
            changeGuideMapZoom(event.deltaY < 0 ? 0.12 : -0.12);
        }, { passive: false });

        guideMapCanvas.addEventListener("dblclick", function (event) {
            event.preventDefault();
            changeGuideMapZoom(0.2);
        });

        guideMapExpandButton.addEventListener("click", function (event) {
            event.stopPropagation();
            const expanded = guidePageElement.classList.toggle("map-expanded");
            guideMapExpandButton.setAttribute("aria-label", expanded ? "Collapse map" : "Expand map");
            guideMapExpandButton.title = expanded ? "Collapse map" : "Expand map";
            guideMapExpandIcon.textContent = expanded ? "↙" : "⛶";
        });

        applyGuideMapZoom();
        renderDowntownRouteCards();
        renderGuideMapRoutes();

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
        // LIVE
        // ==================================================

        const routeCheckboxes =
            document.querySelectorAll(
                ".route-checkbox"
            );


        const liveRouteObjects =
            document.querySelectorAll(
                "[data-route]"
            );


        const mapEmptyMessage =
            get("mapEmptyMessage");


        const nearbyJeepneys =
            get("nearbyJeepneys");


        const liveRouteData = {

            Bajada: {

                name:
                    "Bajada Route",

                eta:
                    "3 min"

            },

            Matina: {

                name:
                    "Matina Route",

                eta:
                    "5 min"

            },

            Toril: {

                name:
                    "Toril Route",

                eta:
                    "7 min"

            }

        };


        function updateLiveMap() {

            const selectedRoutes =
                Array
                    .from(
                        routeCheckboxes
                    )
                    .filter(
                        function (
                            checkbox
                        ) {

                            return (
                                checkbox.checked
                            );

                        }
                    )
                    .map(
                        function (
                            checkbox
                        ) {

                            return (
                                checkbox.value
                            );

                        }
                    );


            liveRouteObjects.forEach(
                function (
                    object
                ) {

                    const route =
                        object.getAttribute(
                            "data-route"
                        );


                    if (
                        selectedRoutes
                            .includes(
                                route
                            )
                    ) {

                        show(
                            object
                        );

                    }

                    else {

                        hide(
                            object
                        );

                    }

                }
            );


            if (
                selectedRoutes.length === 0
            ) {

                show(
                    mapEmptyMessage
                );

            }

            else {

                hide(
                    mapEmptyMessage
                );

            }


            updateNearbyJeepneys(
                selectedRoutes
            );

        }



        function updateNearbyJeepneys(
            selectedRoutes
        ) {

            nearbyJeepneys.innerHTML =
                "";


            if (
                selectedRoutes.length === 0
            ) {

                nearbyJeepneys.innerHTML =
                    '<div class="empty-saved">No selected routes.</div>';


                return;

            }


            selectedRoutes.forEach(
                function (
                    routeKey
                ) {

                    const route =
                        liveRouteData[
                            routeKey
                        ];


                    const card =
                        document.createElement(
                            "div"
                        );


                    card.className =
                        "nearby-card";


                    card.innerHTML =
                        `
                        <div>

                            <span class="status-live">
                                ● LIVE
                            </span>

                            <strong>
                                ${route.name}
                            </strong>

                        </div>

                        <span class="nearby-eta">
                            ${route.eta}
                        </span>
                        `;


                    nearbyJeepneys
                        .appendChild(
                            card
                        );

                }
            );

        }


        routeCheckboxes.forEach(
            function (
                checkbox
            ) {

                checkbox.addEventListener(
                    "change",
                    updateLiveMap
                );

            }
        );


        updateLiveMap();



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