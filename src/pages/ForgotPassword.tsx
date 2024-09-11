import React, { useState } from 'react';
import { useAuthActions } from "@convex-dev/auth/react";
import { Link, useNavigate } from 'react-router-dom';
import Object from '../images/logo/objects.svg';
import { toast } from 'react-toastify'; 
import 'react-toastify/dist/ReactToastify.css'; 

const PasswordReset = () => {
  const { signIn } = useAuthActions();
  const [step, setStep] = useState<"forgot" | { email: string }>("forgot");
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="flex h-screen flex-wrap items-center">
          <div className="w-full border-stroke dark:border-strokedark xl:w-1/2 xl:border-l-2">
            <div className="w-full p-4 sm:p-12.5 xl:p-17.5">
              <h2 className="mb-1 text-2xl font-bold text-black dark:text-white sm:text-title-xl2">
                Recover your password
              </h2>
              <span className="mb-9 block font-medium">Enter your Email to get your sign in details</span>

            {step === "forgot" ? (
              <form 
                onSubmit={(event) => {
                  event.preventDefault();
                  const formData = new FormData(event.currentTarget);
                  void signIn("password", formData).then(() =>
                    setStep({ email: formData.get("email") as string }),
                  );
                }}
              >
                <div className="mb-4">
                  <label className="mb-2.5 block font-medium text-black dark:text-white">
                    Email address
                  </label>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      placeholder="Enter email address"
                      className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 outline-none focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                      value={email}
                      required
                      onChange={(e) => setEmail(e.target.value)}
                    />

                    <span className="absolute right-4 top-4">
                      <svg
                        className="fill-current"
                        width="22"
                        height="22"
                        viewBox="0 0 22 22"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g opacity="0.5">
                          <path
                            d="M19.2516 3.30005H2.75156C1.58281 3.30005 0.585938 4.26255 0.585938 5.46567V16.6032C0.585938 17.7719 1.54844 18.7688 2.75156 18.7688H19.2516C20.4203 18.7688 21.4172 17.8063 21.4172 16.6032V5.4313C21.4172 4.26255 20.4203 3.30005 19.2516 3.30005ZM19.2516 4.84692C19.2859 4.84692 19.3203 4.84692 19.3547 4.84692L11.0016 10.2094L2.64844 4.84692C2.68281 4.84692 2.71719 4.84692 2.75156 4.84692H19.2516ZM19.2516 17.1532H2.75156C2.40781 17.1532 2.13281 16.8782 2.13281 16.5344V6.35942L10.1766 11.5157C10.4172 11.6875 10.6922 11.7563 10.9672 11.7563C11.2422 11.7563 11.5172 11.6875 11.7578 11.5157L19.8016 6.35942V16.5688C19.8703 16.9125 19.5953 17.1532 19.2516 17.1532Z"
                            fill=""
                          />
                        </g>
                      </svg>
                    </span>
                  </div>
                </div>

                <div>
                  <input name="flow" type="hidden" value="reset" />
                </div>

              <div className="mb-5">
              <button
                  type="submit"
                  className={`w-full cursor-pointer rounded-lg border border-primary bg-primary p-4 text-white transition hover:bg-opacity-90 ${
                    loading ? 'opacity-50 cursor-wait' : ''
                  }`}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Send Code'} {/* Change button text based on loading state */}
                </button>
              </div>
               

                <div className="mb-9">
                  <p>
                    <Link to="/" className="">
                      Sign In
                    </Link>
                  </p>
                </div>
              </form>
            ) : (
            <form
              onSubmit={(event) => {
                event.preventDefault();
                const formData = new FormData(event.currentTarget);
                void signIn("password", formData);
              }}
            >
              <input name="code" placeholder="Code" type="text" />
              <input name="newPassword" placeholder="New password" type="password" />
              <input name="email" value={step.email} type="hidden" />
              <input name="flow" value="reset-verification" type="hidden" />
              <button type="submit">Continue</button>
              <button type="button" onClick={() => setStep("signIn")}>
                Cancel
              </button>
            </form>
          )}
            </div>
          </div>

          <div className="hidden h-screen w-full xl:block xl:w-1/2 bg-primary border-stroke dark:border-strokedark xl:border-l-2">
            <div className="px-26 text-center">
              <span className="inline-block">
              <img className="dark:hidden h-screen" src={Object} alt="Signin image" />
              </span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default PasswordReset;



