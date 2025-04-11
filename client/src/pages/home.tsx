import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Calendar, Clock, Video, Check } from "lucide-react";

export default function Home() {
  return (
    <div>
      {/* Hero section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-neutral-800 leading-tight">
                Professional Technical Support, <span className="text-primary">From Home</span>
              </h1>
              <p className="mt-4 text-lg text-neutral-600 max-w-2xl">
                MindConnect provides convenient telehealth services connecting you with our qualified tutor/technician through secure Zoom sessions.
              </p>
              <div className="mt-8">
                <Link href="/appointment">
                  <Button size="lg" className="mr-4">
                    Schedule Appointment
                  </Button>
                </Link>
                <Button variant="outline" size="lg">
                  Learn More
                </Button>
              </div>
            </div>
            <div className="md:w-1/2 mt-10 md:mt-0">
              <div className="bg-white p-8 rounded-lg shadow-md">
                <div className="flex items-center space-x-4 mb-6">
                  <div className="h-16 w-16 rounded-full bg-primary flex items-center justify-center text-white">
                    <Video size={32} />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-neutral-800">Virtual Consultations</h2>
                    <p className="text-neutral-600">Connect from anywhere via Zoom</p>
                  </div>
                </div>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span className="text-neutral-700">Secure, private video sessions</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span className="text-neutral-700">Certified tutor/technician</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span className="text-neutral-700">Convenient scheduling options</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mt-0.5 mr-2" />
                    <span className="text-neutral-700">Personalized care plans</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How it works section */}
      <div className="py-16" id="services">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">How MindConnect Works</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Our telehealth service makes it easy to get the technical support you need in three simple steps.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Calendar className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">1. Schedule</h3>
              <p className="text-neutral-600">
                Choose a convenient date and time for your telehealth appointment.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">2. Complete Intake</h3>
              <p className="text-neutral-600">
                Fill out a brief questionnaire to help us understand your needs better.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200 text-center">
              <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
                <Video className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-neutral-800 mb-2">3. Connect</h3>
              <p className="text-neutral-600">
                Join your Zoom appointment with Technician Aaron Harmon.
              </p>
            </div>
          </div>
          
          <div className="mt-12 text-center">
            <Link href="/appointment">
              <Button>
                Schedule Your Appointment
              </Button>
            </Link>
          </div>
        </div>
      </div>
      
      {/* About section */}
      <div className="bg-neutral-50 py-16" id="about">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="md:flex md:items-center md:justify-between">
            <div className="md:w-1/2">
              <h2 className="text-3xl font-bold text-neutral-800">About MindConnect</h2>
              <p className="mt-4 text-lg text-neutral-600">
                MindConnect was founded with a mission to make technical support accessible to everyone, regardless of location. Our tutor/technician is dedicated to providing quality assistance through telehealth services.
              </p>
              <p className="mt-4 text-lg text-neutral-600">
                We believe in a personalized approach to technical support, focusing on your unique needs and goals to help you tackle your technical challenges.
              </p>
            </div>
            <div className="md:w-1/2 mt-8 md:mt-0 md:pl-12">
              <div className="bg-white p-6 rounded-lg shadow-sm border border-neutral-200">
                <blockquote className="italic text-neutral-700">
                  "At MindConnect, we're committed to breaking down barriers to technical support. Our telehealth platform ensures that quality assistance is just a click away."
                </blockquote>
                <div className="mt-4 flex items-center">
                  <div className="h-10 w-10 rounded-full bg-primary flex items-center justify-center text-white font-medium">
                    AH
                  </div>
                  <div className="ml-3">
                    <p className="font-medium text-neutral-800">Technician Aaron Harmon</p>
                    <p className="text-sm text-neutral-500">Lead Tutor/Technician, MindConnect</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Contact section */}
      <div className="py-16" id="contact">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-neutral-800">Contact Us</h2>
            <p className="mt-4 text-lg text-neutral-600 max-w-2xl mx-auto">
              Have questions about our services? Get in touch with our team.
            </p>
          </div>
          
          <div className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-sm border border-neutral-200">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">Get In Touch</h3>
                <div className="space-y-4">
                  <div className="flex items-start">
                    <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center text-primary mr-3">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-neutral-800">Email</p>
                      <a href="mailto:mindconnect127001@gmail.com" className="text-primary">mindconnect127001@gmail.com</a>
                    </div>
                  </div>
                </div>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold text-neutral-800 mb-4">Hours of Operation</h3>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Monday - Friday</span>
                    <span className="text-neutral-800 font-medium">9:00 AM - 5:00 PM</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Saturday</span>
                    <span className="text-neutral-800 font-medium">Closed</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-neutral-600">Sunday</span>
                    <span className="text-neutral-800 font-medium">Closed</span>
                  </div>
                </div>
                <div className="mt-6">
                  <Link href="/appointment">
                    <Button className="w-full">Schedule Now</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
