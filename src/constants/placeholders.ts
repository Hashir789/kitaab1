export enum authButtonLabel {
  BACK = "Back",
  NEXT = "Next",
  SENT = "Sent",
  SKIP = "Skip",
  LOGIN = "Login",
  VERIFY = "Verify",
  ENABLE = "Enable",
  SIGN_UP = "Sign up",
  NOT_NOW = "Not now",
  SENDING = "Sending...",
  SEND_LINK = "Send link",
  UPDATING = "Updating...",
  CHECKING = "Checking...",
  ENABLING = "Enabling...",
  VERIFYING = "Verifying...",
  RESEND_LINK = "Resend link",
  LOGGING_IN = "Logging in...",
  SIGNING_UP = "Signing up...",
  DEMO_ACCOUNT = "Demo Account",
  UPDATE_PASSWORD = "Update password"
}

export enum authLabel {
  EMAIL = "Email",
  GENDER = "gender",
  PASSWORD = "Password",
  FULL_NAME = "Full name",
  RECOVERY_KEY = "Recovery key",
  NEW_PASSWORD = "New password",
  DATE_OF_BIRTH = "Date of Birth",
  CONFIRM_PASSWORD = "Confirm Password"
}

export enum authPlaceholder {
  PASSWORD = "Pass@123",
  FULL_NAME = "John Doe",
  EMAIL = "your@mail.com",
  DATE_OF_BIRTH = "DD-MM-YYYY",
  SELECT_GENDER = "Select gender",
  RECOVERY_KEY = "XXXX-XXXX-XXXX-..."
}

export enum authAria {
  EMAIL = "Email",
  PASSWORD = "Password",
  FULL_NAME = "Full name",
  KITAAB_LOGO = "Kitaab logo",
  NEW_PASSWORD = "New password",
  RECOVERY_KEY = "Recovery key",
  DATE_OF_BIRTH = "Date of birth",
  SELECT_GENDER = "Select gender",
  CONFIRM_PASSWORD = "Confirm password",
  DOWNLOAD_RECOVERY_KEY = "Download recovery key"
}

export enum authHeading {
  CHECK_EMAIL = "Check your email",
  VERIFY_ITS_YOU = "Verify it's you",
  ACCOUNT_CREATED = "Account created",
  RESET_PASSWORD = "Reset your password",
  VERIFY_YOUR_EMAIL = "Verify your email",
  RECORD_EXISTS = "We already have your record",
  ENABLE_TWO_FACTOR = "Enable two-factor authentication",
  SENDING_VERIFICATION_CODE = "Sending verification code",
  ENABLE_TWO_FACTOR_QUESTION = "Enable two-factor authentication?"
}

export enum authDescription {
  OTP_CODE_SUFFIX = ".",
  RESEND_CODE_PROMPT = "Didn't get the code?",
  RESET_REDIRECTING = "Redirecting to login...",
  OTP_SENDING = "Hang on while we email your code...",
  FORGOT_LINK_SENT_SUFFIX = ". You may close this tab.",
  OTP_CODE_PREFIX = "Enter the 4-digit code we sent to ",
  FORGOT_LINK_SENT_PREFIX = "A reset link has been sent to ",
  OTP_REDIRECTING = "Redirecting you to verify your email...",
  RECOVERY_KEY_NOT_SHOWN_AGAIN = "This key will not be shown again",
  DOWNLOAD_RECOVERY_KEY_TO_CONTINUE = "Download the recovery key file to continue",
  FORGOT_PASSWORD = "Enter your full name and email. We'll send a reset link to your inbox.",
  RESET_PASSWORD = "Enter the recovery key you saved during signup and choose a new password.",
  SIGNUP_TWO_FACTOR = "Add an extra layer of security to your account by requiring a code at sign-in.",
  RECOVERY_KEY_SAVE = "Save this key. If you forget your password and don't have it, all your data will be permanently lost.",
  LOGIN_TWO_FACTOR = "Add an extra layer of security to your account. You'll be asked for a code sent to your email each time you login."
}

export enum authLink {
  RETURN_HOME = "Return to Home",
  FORGOT_PASSWORD = "Forgot password?"
}

export enum authMisc {
  OR = "OR",
  NO_ACCOUNT = "Don't have an account?",
  HAS_ACCOUNT = "Already have an account?"
}

export enum authToast {
  AUTH_FAILED = "Authentication failed",
  RESET_FAILED = "Password reset failed"
}

export enum authValidation {
  DOB_FORMAT = "Use DD-MM-YYYY",
  GENDER_SELECT = "Select a gender",
  EMAIL_REQUIRED = "Email is required",
  GENDER_REQUIRED = "gender is required",
  DOB_REQUIRED = "Date of birth is required",
  CONFIRM_PASSWORD = "Confirm your password",
  PASSWORD_REQUIRED = "Password is required",
  FULL_NAME_REQUIRED = "Full name is required",
  PASSWORDS_MUST_MATCH = "Passwords must match",
  PASSWORD_NUMBER = "Please enter at least a number",
  RECOVERY_KEY_REQUIRED = "Recovery key is required",
  EMAIL_INVALID = "Please enter a valid email address",
  RECOVERY_KEY_INVALID = "Invalid recovery key format",
  EMAIL_EXISTS = "User with this email already exists",
  FULL_NAME_INVALID = "Please enter a valid full name",
  PASSWORD_MIN_8 = "Please enter at least 8 characters",
  PASSWORD_SPECIAL = "Please enter a special character",
  FULL_NAME_MIN_2 = "Please enter at least 2 characters",
  FULL_NAME_MIN_3 = "Please enter at least 3 characters",
  FULL_NAME_MAX_60 = "Please enter at most 60 characters",
  DOB_NOT_FUTURE = "Date of birth cannot be in the future",
  PASSWORD_LOWERCASE = "Please enter at least a lowercase",
  PASSWORD_UPPERCASE = "Please enter at least an uppercase"
}

export enum accountLabel {
  EMAIL = "Email",
  GENDER = "Gender",
  FULL_NAME = "Full name",
  DATE_OF_BIRTH = "Date of birth",
  TWO_FACTOR_AUTH = "Two-factor auth"
}

export enum accountButtonLabel {
  LOG_OUT = "Log out"
}

export enum accountStatus {
  ENABLED = "Enabled",
  DISABLED = "Disabled"
}

export enum accountMessage {
  FETCHING_DATA = "We are fetching data..."
}

export enum sidebarLabel {
  DEEDS = "Deeds",
  LOGOUT = "Logout",
  RECORDS = "Records",
  PROFILE = "Profile",
  DASHBOARD = "Dashboard",
  SCORECARDS = "Scorecards"
}

export enum sidebarAria {
  USER_MENU = "User menu",
  OPEN_SIDEBAR = "Open sidebar",
  CLOSE_SIDEBAR = "Close sidebar",
  KITAAB_DASHBOARD = "Kitaab dashboard",
  AFTER_LOGIN_SIDEBAR = "After login sidebar"
}

export enum sidebarMisc {
  INITIALS_FALLBACK = "U",
  PROFILE_FALLBACK = "Profile",
  SIGNED_IN_FALLBACK = "Signed in"
}

export enum breadcrumbAria {
  BREADCRUMBS = "Breadcrumbs"
}

export const breadcrumbTabLabel = (index: number): string => `Tab ${index + 1}`;

export enum homeBetaText {
  AYAH_ARABIC = "ﮭ ﮮ ﮯ ﮰ ﮱ ﯓ ﯔ",
  QUOTE_BODY_APP_NAME = "Kitaab",
  QUOTE_BODY_CONCEPT = "Amaal Naama",
  AYAH_TRANSLATION_KEYWORD = "kitaab",
  AYAH_TRANSLATION_PREFIX = "Read your ",
  QUOTE_BODY_MIDDLE = ", Book of Deeds, ",
  QUOTE_BODY_PREFIX = "Inspired by the concept of ",
  AYAH_TRANSLATION_SUFFIX = ". You yourself are sufficient as your accountant today.",
  QUOTE_INTRO = "Every day, you make choices, but most go unrecorded. Without tracking them, improvement becomes unclear.",
  QUOTE_BODY_SUFFIX = " is a personal deed tracking app that helps you track your deeds, reflect clearly, grow consistently, and improve every day."
}

export enum homeCharlieText {
  HASANAAT = "Hasanaat",
  SAYYIAAT = "Sayyiaat",
  QUOTE_MIDDLE = " and ",
  AYAH_ARABIC = "ﮱ ﯓ ﯔ ﯕ",
  QUOTE_APP_NAME = "Kitaab",
  DICTIONARY_ORIGIN = "Arabic",
  HASANAAT_PLURAL_OF = "Hasanah",
  SAYYIAAT_PLURAL_OF = "Sayyi'ah",
  QUOTE_PREFIX = "With dedicated ",
  QUOTE_AFTER_SECTIONS = " sections, ",
  HASANAAT_PRONUNCIATION = "/ha-sa-naat/",
  SAYYIAAT_PRONUNCIATION = "/say-yi-aat/",
  AYAH_TRANSLATION = "Indeed, good deeds remove bad deeds.",
  SAYYIAAT_MEANING = "Bad deeds; sinful or wrongful actions.",
  HASANAAT_MEANING = "Good deeds; righteous or virtuous actions.",
  QUOTE_SUFFIX = " doesn't limit you to tracking prayers only; you can record any kind of good or bad deeds."
}

export enum footerText {
  LEGAL = "Legal",
  CONTACT = "Contact",
  NAVIGATION = "Navigation",
  PHONE = "+92 333 8701145",
  EMAIL = "support@kitaab.me",
  DESCRIPTION_APP_NAME = "Kitaab",
  TOOLTIP = "Be Your Own Accountant",
  DESCRIPTION_CONCEPT = "Amaal Naama",
  DESCRIPTION_MIDDLE = ", Book of Deeds, ",
  LOGO_ARIA = "Kitaab Islamic Deed Tracker home",
  LOGO_ALT = "Kitaab – Islamic Deed Tracker logo",
  LOGO_TITLE = "Kitaab – Islamic Deed Tracker Home",
  DESCRIPTION_PREFIX = "Inspired by the concept of ",
  COPYRIGHT_SUFFIX = " Kitaab. All rights reserved.",
  DESCRIPTION_SUFFIX = " is a personal deed tracking app that helps you track your deeds, reflect clearly, grow consistently, and improve every day."
}

export const footerNavigationItems = [
  { label: "Home", link: "/" },
  { label: "Features", link: "/features" },
  { label: "About", link: "/about" },
  { label: "Contact", link: "/contact" }
] as const;

export const footerLegalItems = [
  { label: "Sitemap", link: "/sitemap" },
  { label: "Privacy Policy", link: "/privacy-policy" },
  { label: "Terms of Service", link: "/terms-of-service" },
  { label: "Cookie Policy", link: "/cookie-policy" }
] as const;

export enum footerSocialAria {
  YOUTUBE = "Follow us on YouTube",
  TWITTER = "Follow us on Twitter",
  LINKEDIN = "Follow us on LinkedIn",
  FACEBOOK = "Follow us on Facebook",
  INSTAGRAM = "Follow us on Instagram"
}

export enum contactPageText {
  EMAIL_LABEL = "Email",
  KICKER = "Get in touch",
  TITLE = "Talk to the Kitaab team",
  RESPONSE_TIME = "Typical response time: within 24 hours",
  DESCRIPTION = "Share your questions, feedback, or partnership ideas and we’ll respond as soon as possible.",
  BODY = "We’re here to support you on your journey with Kitaab, whether you have questions, need help, or want to share feedback."
}

export enum legalPageText {
  HOME = "Home",
  EMAIL = "Email",
  PHONE = "Phone",
  CONTACT_US = "Contact Us",
  ORGANIZATION_NAME = "Kitaab",
  LAST_UPDATED = "Last updated: ",
  ORGANIZATION_URL = "https://www.kitaab.me"
}

export enum cookiePolicyText {
  TITLE = "Cookie Policy",
  COOKIE_DURATION = "Cookie Duration",
  WHAT_ARE_COOKIES = "What Are Cookies",
  MANAGING_COOKIES = "Managing Cookies",
  ESSENTIAL_COOKIES = "Essential Cookies",
  ANALYTICS_COOKIES = "Analytics Cookies",
  MARKETING_COOKIES = "Marketing Cookies",
  HOW_WE_USE_COOKIES = "How We Use Cookies",
  FUNCTIONAL_COOKIES = "Functional Cookies",
  UPDATES = "Updates to This Cookie Policy",
  THIRD_PARTY_COOKIES = "Third-Party Cookies",
  TYPES_OF_COOKIES = "Types of Cookies We Use",
  DELETE_COOKIES = "Delete cookies from your browser settings",
  BLOCK_COOKIES = "Block cookies through your browser settings",
  EXTENSIONS_COOKIES = "Use browser extensions or add-ons to manage cookies",
  NOTIFY_COOKIES = "Set your browser to notify you when cookies are being set",
  DESCRIPTION = "Learn about how Kitaab uses cookies to enhance your experience and how you can manage them.",
  CONTACT_BODY = "If you have any questions about our use of cookies or this Cookie Policy, please contact us at:",
  MANAGING_COOKIES_NOTE = "Please note that if you disable cookies, some features of our website may not function properly.",
  MARKETING_COOKIES_BODY = "These cookies are used to track visitors across websites to display relevant advertisements and measure the effectiveness of our marketing campaigns.",
  MANAGING_COOKIES_BODY = "Most web browsers allow you to control cookies through their settings preferences. However, limiting cookies may impact your ability to use our website. You can:",
  ANALYTICS_COOKIES_BODY = "These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve our website and user experience.",
  ESSENTIAL_COOKIES_BODY = "These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt-out of these cookies.",
  FUNCTIONAL_COOKIES_BODY = "These cookies enable enhanced functionality and personalization, such as remembering your preferences and settings. They may be set by us or by third-party providers whose services we have added to our pages.",
  WHAT_ARE_COOKIES_BODY = "Cookies are small text files that are placed on your computer or mobile device when you visit a website. They are widely used to make websites work more efficiently and provide information to the website owners.",
  UPDATES_BODY = "We may update this Cookie Policy from time to time to reflect changes in technology, legislation, or our data use practices. We will notify you of any material changes by posting the new Cookie Policy on this page and updating the \"Last updated\" date.",
  THIRD_PARTY_COOKIES_BODY = "In addition to our own cookies, we may also use various third-party cookies to report usage statistics of the service, deliver advertisements, and so on. These third-party cookies are governed by the respective privacy policies of those third parties.",
  HOW_WE_USE_COOKIES_BODY = "Kitaab uses cookies to enhance your experience, analyze site usage, and assist in our marketing efforts. We use both session cookies (which expire when you close your browser) and persistent cookies (which remain on your device until deleted or expired).",
  COOKIE_DURATION_BODY = "Cookies may be either \"persistent\" cookies or \"session\" cookies. A persistent cookie remains on your device after you close your browser and may be used by your browser on subsequent visits to our website. A session cookie is temporary and disappears after you close your browser."
}

export enum privacyPolicyText {
  TITLE = "Privacy Policy",
  YOUR_RIGHTS = "Your Rights",
  INTRODUCTION = "Introduction",
  DATA_SECURITY = "Data Security",
  DATA_RETENTION = "Data Retention",
  DATA_PORTABILITY = "Data portability",
  CHILDREN_PRIVACY = "Children's Privacy",
  DEVICE_INFORMATION = "Device information",
  USAGE_DATA = "Usage data and preferences",
  CHANGES = "Changes to This Privacy Policy",
  YOUR_RIGHTS_BODY = "You have the right to:",
  THIRD_PARTY_SERVICES = "Third-Party Services",
  INFORMATION_WE_COLLECT = "Information We Collect",
  HOW_WE_USE_INFORMATION = "How We Use Your Information",
  PROVIDE_SERVICES = "Provide and maintain our services",
  REQUEST_DELETION = "Request deletion of your personal data",
  SEND_UPDATES = "Send you important updates and notifications",
  RECTIFY_DATA = "Rectify inaccurate or incomplete information",
  IMPROVE_EXPERIENCE = "Improve and personalize your experience",
  ACCESS_DATA = "Access and receive a copy of your personal data",
  ACCOUNT_INFORMATION = "Account information (name, email address)",
  OBJECT_PROCESSING = "Object to or restrict processing of your data",
  HOW_WE_USE_INFORMATION_BODY = "We use the information we collect to:",
  ENSURE_SECURITY = "Ensure the security and integrity of our platform",
  DEED_TRACKING_DATA = "Deed tracking data (Hasanaat and Sayyiaat entries)",
  PROCESS_TRANSACTIONS = "Process your transactions and manage your account",
  CONTACT_BODY = "If you have any questions about this Privacy Policy, please contact us at:",
  DESCRIPTION = "Learn how Kitaab protects your privacy and handles your personal information.",
  INFORMATION_WE_COLLECT_BODY = "We may collect information that you provide directly to us, including:",
  CHANGES_BODY = "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the \"Last updated\" date.",
  DATA_RETENTION_BODY = "We retain your personal information for as long as necessary to provide our services and fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law.",
  INTRODUCTION_BODY = "At Kitaab, we are committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our Islamic deed tracking application.",
  THIRD_PARTY_SERVICES_BODY = "Our application may contain links to third-party websites or services. We are not responsible for the privacy practices of these third parties. We encourage you to review their privacy policies.",
  CHILDREN_PRIVACY_BODY = "Our services are not intended for children under the age of 13. We do not knowingly collect personal information from children under 13. If you become aware that a child has provided us with personal information, please contact us.",
  DATA_SECURITY_BODY = "We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure."
}

export enum termsOfServiceText {
  DISCLAIMER = "Disclaimer",
  TITLE = "Terms of Service",
  USE_LICENSE = "Use License",
  TERMINATION = "Termination",
  CHANGES = "Changes to Terms",
  USER_CONTENT = "User Content",
  USER_ACCOUNTS = "User Accounts",
  GOVERNING_LAW = "Governing Law",
  AGREEMENT = "Agreement to Terms",
  PROHIBITED_USES = "Prohibited Uses",
  INTELLECTUAL_PROPERTY = "Intellectual Property",
  MODIFY_MATERIALS = "Modify or copy the materials",
  LIMITATION_OF_LIABILITY = "Limitation of Liability",
  PROHIBITED_USES_BODY = "You may not use our application:",
  MALICIOUS_CODE = "To transmit any malicious code or viruses",
  IMPERSONATE = "To impersonate or attempt to impersonate another user",
  VIOLATE_LAW = "In any way that violates any applicable law or regulation",
  UNAUTHORIZED_LINKING = "To engage in any unauthorized framing or linking",
  IMPAIR_APP = "In any manner that could disable, overburden, or impair the application",
  COMMERCIAL_USE = "Use the materials for any commercial purpose or for any public display",
  REVERSE_ENGINEER = "Attempt to reverse engineer any software contained in the application",
  REMOVE_NOTATIONS = "Remove any copyright or other proprietary notations from the materials",
  CONTACT_BODY = "If you have any questions about these Terms of Service, please contact us at:",
  DESCRIPTION = "Read Kitaab's Terms of Service to understand the rules and guidelines for using our Islamic deed tracking application.",
  GOVERNING_LAW_BODY = "These Terms shall be interpreted and governed by the laws of the jurisdiction in which Kitaab operates, without regard to its conflict of law provisions.",
  CHANGES_BODY = "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material, we will provide at least 30 days notice prior to any new terms taking effect.",
  USE_LICENSE_BODY = "Permission is granted to temporarily use Kitaab for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:",
  TERMINATION_BODY = "We may terminate or suspend your account and bar access to the application immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms.",
  INTELLECTUAL_PROPERTY_BODY = "The application and its original content, features, and functionality are owned by Kitaab and are protected by international copyright, trademark, patent, trade secret, and other intellectual property laws.",
  AGREEMENT_BODY = "By accessing or using Kitaab, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this application.",
  USER_ACCOUNTS_BODY = "When you create an account with us, you must provide information that is accurate, complete, and current at all times. You are responsible for safeguarding the password and for all activities that occur under your account.",
  DISCLAIMER_BODY = "The information on this application is provided on an \"as is\" basis. To the fullest extent permitted by law, Kitaab excludes all representations, warranties, and conditions relating to our application and the use of this application.",
  USER_CONTENT_BODY = "Our application allows you to track and store your personal deeds (Hasanaat and Sayyiaat). You retain ownership of any intellectual property rights that you hold in the content you submit. By submitting content, you grant us a license to use, store, and process that content.",
  LIMITATION_OF_LIABILITY_BODY = "In no event shall Kitaab, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential, or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses."
}

export const authAriaDigit = (index: number): string => `Digit ${index + 1}`;