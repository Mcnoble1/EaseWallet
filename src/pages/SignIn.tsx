import { useState, useEffect, useContext, } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Object from '../images/logo/objects@2x.png';
import { toast } from 'react-toastify';
import { AppContext } from "../utils/AppContext";
import 'react-toastify/dist/ReactToastify.css';
import './signin.css';


const SignIn = () => {
  const { signIn } = useContext( AppContext );
  const [step, setStep] = useState<"signIn" | "signUp" | { email: string } >("signIn");

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

    const handleSignIn = async (e) => { 
      e.preventDefault();

        setLoading(true); 
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        signIn("password-code", formData).then(() => {
          if (step === "signIn") {
            navigate("/dashboard");
          } else {
            setStep({ email: formData.get("email") as string });
            }
          }
        ).catch((error) => {
          console.error(error);
          const title = step === "signIn"
              ? "Email or password incorrect, did you mean to sign up?"
              : "Could not sign up, did you mean to log in?";
          toast.error( title, { autoclose: 3000 });
        });
        setLoading(false);
      }


  return (
    <>
    <div className="h-screen w-full text-white bg-[#16161A] px-10 lg:px-20 flex justify-center items-center lg:block">
      <div className="flex flex-wrap items-center">
        <div className="w-full xl:w-3/5"> 
          <div className="">
            <h2 className="mb-5 text-2xl font-bold text-white dark:text-white sm:text-title-xl2">
              EaseWallet
            </h2>
            {/* <span className="mb-5 block text-white font-medium">Enter your portable DID to sign in</span> */}

            {step === "signIn" || step === "signUp" ? (
            <form onSubmit={handleSignIn} className='w-[100%] lg:w-[80%]'>
              <div className="mb-4 ">
                <label className="mb-2.5 block font-medium text-white dark:text-white">
                  Email address
                </label>
                <div className={`relative`}>
                  <input
                    name='email'
                    type="email"
                    placeholder="Email address"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:focus:border-primary"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="mb-2.5 block font-medium text-white dark:text-white">
                  Password
                </label>
                <div className={`relative`}>
                  <input
                    name='password'
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Enter password"
                    className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                    required
                  />

                  <span
                      className="absolute right-4 top-4 cursor-pointer"
                      onClick={() => setShowPassword(!showPassword)} 
                    >
                      {showPassword ? (
                        <svg
                          className="fill-current"
                          width="22"
                          height="22"
                          viewBox="0 0 22 22"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <svg
                              width="22"
                              height="22"
                              viewBox="0 0 22 22"
                              fill="none"
                              xmlns="http://www.w3.org/2000/svg"
                            >
                              <path
                                fill-rule="evenodd"
                                clip-rule="evenodd"
                                d="M16.5 11C16.5 12.933 14.933 14.5 13 14.5C11.067 14.5 9.5 12.933 9.5 11C9.5 9.067 11.067 7.5 13 7.5C14.933 7.5 16.5 9.067 16.5 11ZM12 3C4.834 3 3 11 3 11C3 11 4.834 19 12 19C19.166 19 21 11 21 11C21 11 19.166 3 12 3ZM11 15H13V13H11V15ZM11 9H13V7H11V9Z"
                                fill="#000000"
                              />
                            </svg>

                        </svg>
                      ) : (
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
                              d="M16.1547 6.80626V5.91251C16.1547 3.16251 14.0922 0.825009 11.4797 0.618759C10.0359 0.481259 8.59219 0.996884 7.52656 1.95938C6.46094 2.92188 5.84219 4.29688 5.84219 5.70626V6.80626C3.84844 7.18438 2.33594 8.93751 2.33594 11.0688V17.2906C2.33594 19.5594 4.19219 21.3813 6.42656 21.3813H15.5016C17.7703 21.3813 19.6266 19.525 19.6266 17.2563V11C19.6609 8.93751 18.1484 7.21876 16.1547 6.80626ZM8.55781 3.09376C9.31406 2.40626 10.3109 2.06251 11.3422 2.16563C13.1641 2.33751 14.6078 3.98751 14.6078 5.91251V6.70313H7.38906V5.67188C7.38906 4.70938 7.80156 3.78126 8.55781 3.09376ZM18.1141 17.2906C18.1141 18.7 16.9453 19.8688 15.5359 19.8688H6.46094C5.05156 19.8688 3.91719 18.7344 3.91719 17.325V11.0688C3.91719 9.52189 5.15469 8.28438 6.70156 8.28438H15.2953C16.8422 8.28438 18.1141 9.52188 18.1141 11V17.2906Z"
                              fill=""
                            />
                            <path
                              d="M10.9977 11.8594C10.5852 11.8594 10.207 12.2031 10.207 12.65V16.2594C10.207 16.6719 10.5508 17.05 10.9977 17.05C11.4102 17.05 11.7883 16.7063 11.7883 16.2594V12.6156C11.7883 12.2031 11.4102 11.8594 10.9977 11.8594Z"
                              fill=""
                            />
                          </g>
                        </svg>
                      )}
                    </span>
                </div>
              </div>

              <div>
                <input name="flow" type="hidden" value={step} />
              </div>

              {/* <div className="mb-4">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={rememberMe} 
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="form-checkbox h-5 w-5 text-blue-600"
                />
                <span className="text-white">Remember Me</span>
              </label>
            </div> */}

            <div className="mb-3">
            <button
                type="submit"
                className={`w-full cursor-pointer rounded-lg border border-primary bg-secondary p-4 text-white transition hover:bg-opacity-90 ${
                  loading ? 'opacity-50 cursor-wait animate-spin' : ''                }`}
                disabled={loading}
              >
                {step === "signIn" ? "Log in" : "Sign up"}
              </button>
            </div>
              <p
                className='text-center underline cursor-pointer'
                onClick={() => {
                  setStep(step === "signIn" ? "signUp" : "signIn");
                }}
              >
                {step === "signIn" ? "Sign up instead" : "Log in instead"}
              </p>
              {/* <div className="mb-9">
                <p>
                  <Link to="forgot-password" className="">
                    Forgot password?
                  </Link>
                </p>
              </div> */}
            </form>
                ) : (
                  <form
                    className='w-[100%] lg:w-[80%]'
                    onSubmit={(event) => {
                      event.preventDefault();
                      setLoading(true);
                      const formData = new FormData(event.currentTarget);
                      signIn("password-code", formData)
                      .then(() => 
                        navigate("/dashboard")
                      )
                      .catch((error) => {
                        console.error(error);
                        const title = "Code could not be verified, please try again";
                        toast.error( title, { autoclose: 3000 });
                      });
                      setLoading(false);        
                    }}
                  >
                    <div className='mb-5'>
                      <label className="mb-2.5 block font-medium text-white dark:text-white">
                        Enter the verification code sent to your Email (check your spam)
                      </label>
                      <div>
                        <input
                          name='code'
                          type="text"
                          placeholder="Code"
                          className="w-full rounded-lg border border-stroke bg-transparent py-4 pl-6 pr-10 focus:border-primary focus-visible:shadow-none dark:border-form-strokedark dark:bg-form-input dark:focus:border-primary"
                          required
                        />
                      </div>
                    </div>
                    <input name="email" value={step.email} type="hidden" />
                    <input name="flow" value="email-verification" type="hidden" />
                    <div className='flex gap-5'>
                      <button
                          type="submit"
                          // onClick={() => setLoading(true)}
                          className={`w-full cursor-pointer rounded-lg border border-primary bg-secondary p-4 text-white transition hover:bg-opacity-90 ${
                            loading ? 'opacity-50 cursor-wait animate-spin' : ''
                          }`}
                          disabled={loading}
                        >
                          Continue                
                      </button>

                      <button
                          type="button"
                          onClick={() => setStep("signIn")}
                          className={`w-full cursor-pointer rounded-lg border border-primary bg-danger p-4 text-white transition hover:bg-opacity-90 ${
                            loading ? 'opacity-50 cursor-wait' : ''
                          }`}
                          disabled={loading}
                        >
                          Cancel                
                      </button>
                    </div>
                  </form>
                )}
            </div>
          </div>

        <div className="hidden h-screen lg:block lg:w-2/5 bg-primary">
          <div className="absolute right-10">
            <span className="">
            <img className="h-screen lg:w-[2/5]" src={Object} alt="Signin image" />
            </span>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default SignIn;
