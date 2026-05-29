import { Link } from "react-router-dom";

export default function PrivacyPolicy() {
  return (
    <main className="min-h-screen p-6 -bg--surface-container-low">
      <div className="w-full max-w-4xl mx-auto p-6 md:p-10 rounded-lg bg-white drop-shadow-lg">
        <Link to="/login" className="-text--main-font-color underline">
          Back to login
        </Link>

        <h1 className="text-3xl mt-8 mb-2 font-medium">Privacy Policy</h1>
        <p className="mb-8 -text--secondary">Last updated: May 29, 2026</p>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Overview</h2>
          <p>
            This Privacy Policy explains how Note App handles information when you use the app to
            create notes, to-do lists, and image notes. The app supports both guest use and
            signed-in accounts.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Information We Collect</h2>
          <p className="mb-3">Depending on how you use the app, we may process:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Account information, such as your email address and display name.</li>
            <li>Authentication information handled by Firebase Authentication.</li>
            <li>Notes, to-do lists, tasks, categories, dates, and image-note content you create.</li>
            <li>Guest-mode data stored temporarily in your browser localStorage.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">How Your Data Is Stored</h2>
          <p className="mb-3">
            If you sign in, your notes, to-do lists, and image notes are stored in Cloud Firestore
            under your Firebase user ID. This lets your saved data sync when you use the same
            account.
          </p>
          <p>
            If you use guest mode, your app data is stored only in your browser localStorage.
            Guest data is temporary and may be cleared when you log out as a guest or leave the app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Google Sign-In</h2>
          <p>
            If you choose Google sign-in, Firebase Authentication and Google process your sign-in
            information. The app uses that authentication result to identify your account and save
            your app data to your user-specific Firestore location.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">How We Use Information</h2>
          <p className="mb-3">Your information is used to:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>Provide login and account access.</li>
            <li>Save, load, update, and delete your notes, to-do lists, and image notes.</li>
            <li>Keep guest data separate from signed-in account data.</li>
            <li>Maintain basic app security through Firebase Authentication and Firestore rules.</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Sharing</h2>
          <p>
            We do not sell your personal information. Your information may be processed by Firebase
            and Google services used to provide authentication and data storage for the app.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Deleting Your Data</h2>
          <p>
            You can delete saved notes, to-do lists, images, or all saved app data from the Settings
            page. Guest data can also be cleared by logging out of guest mode.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl mb-3 font-medium">Security</h2>
          <p>
            The app uses Firebase Authentication and user-scoped Firestore paths to help protect
            signed-in user data. No method of online storage is perfect, so you should avoid saving
            highly sensitive information in the app.
          </p>
        </section>

        <section>
          <h2 className="text-xl mb-3 font-medium">Contact</h2>
          <p>
            If you have questions about this Privacy Policy, contact the app owner or developer by email at <a href="mailto:bcitwordpress@gmail.com" className="underline">bcitwordpress@gmail.com</a>.
          </p>
        </section>
      </div>
    </main>
  );
}
