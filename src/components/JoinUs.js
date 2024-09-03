import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Upload, MapPin, User, Briefcase, Send } from 'lucide-react';

const JoinUsPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    location: '',
    position: '',
    cv: null,
    whyJoin: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitMessage, setSubmitMessage] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    setFormData(prevState => ({
      ...prevState,
      cv: e.target.files[0]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitMessage('');

    const form = e.target;
    const formData = new FormData(form);

    // Remove the file input from formData as we'll handle it separately
    formData.delete('cv');

    try {
      // Submit form data to Netlify
      const response = await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams(formData).toString(),
      });

      if (response.ok) {
        setSubmitMessage('Application submitted successfully!');
        // Reset form
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          location: '',
          position: '',
          cv: null,
          whyJoin: ''
        });
        // You might want to handle file upload separately here
        // For example, upload to S3 and then update the form submission with the file URL
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting application:', error);
      setSubmitMessage('An error occurred. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="container mx-auto px-6 py-4">
        <div className="flex justify-between items-center">
          <div className="text-2xl font-bold">
            <span className="text-gray-800">Voi</span>
            <span className="text-indigo-600">Bot</span>
          </div>
          <button onClick={() => navigate('/')} className="text-indigo-600 hover:text-indigo-800 transition duration-300">
            Back to Home
          </button>
        </div>
      </nav>

      <div className="container mx-auto px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="bg-white rounded-lg shadow-xl overflow-hidden"
        >
          <div className="md:flex">
            <div className="md:w-1/2 bg-indigo-600 text-white p-8 md:p-12">
              <h2 className="text-3xl font-bold mb-4">Join Our Team of Innovators</h2>
              <p className="mb-6">At VoiBot, we're revolutionizing the way businesses interact with their customers. Join us in shaping the future of AI-driven communication.</p>
              <ul className="space-y-2">
                <li className="flex items-center"><User className="mr-2" /> Collaborative work environment</li>
                <li className="flex items-center"><Briefcase className="mr-2" /> Challenging projects</li>
                <li className="flex items-center"><MapPin className="mr-2" /> Flexible work locations</li>
              </ul>
            </div>
            <div className="md:w-1/2 p-8 md:p-12">
              <h3 className="text-2xl font-semibold text-gray-800 mb-6">Apply Now</h3>
              <form
                name="join-us"
                method="POST"
                data-netlify="true"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="join-us" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="firstName"
                    placeholder="First Name"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                  <input
                    type="text"
                    name="lastName"
                    placeholder="Last Name"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    required
                  />
                </div>
                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <input
                  type="text"
                  name="location"
                  placeholder="Location (City, Country)"
                  value={formData.location}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                />
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  required
                >
                  <option value="">Select a Position</option>
                  <option value="ai-engineer">AI Engineer</option>
                  <option value="frontend-developer">Frontend Developer</option>
                  <option value="backend-developer">Backend Developer</option>
                  <option value="product-manager">Product Manager</option>
                  <option value="ux-designer">UX Designer</option>
                </select>
                <div className="flex items-center space-x-2">
                  <label htmlFor="cv" className="flex items-center px-4 py-2 bg-white text-indigo-600 rounded-md border border-indigo-600 cursor-pointer hover:bg-indigo-50 transition duration-300">
                    <Upload className="mr-2" />
                    Upload CV
                  </label>
                  <input
                    id="cv"
                    type="file"
                    name="cv"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    required
                  />
                  {formData.cv && <span className="text-sm text-gray-600">{formData.cv.name}</span>}
                </div>
                <textarea
                  name="whyJoin"
                  placeholder="Why do you want to join VoiBot?"
                  value={formData.whyJoin}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  rows="4"
                  required
                ></textarea>
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-6 py-3 rounded-md font-semibold hover:bg-indigo-700 transition duration-300 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span>Submitting...</span>
                  ) : (
                    <>
                      <Send className="mr-2" />
                      Submit Application
                    </>
                  )}
                </button>
                {submitMessage && (
                  <p className={`text-center ${submitMessage.includes('successfully') ? 'text-green-600' : 'text-red-600'}`}>
                    {submitMessage}
                  </p>
                )}
              </form>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default JoinUsPage;