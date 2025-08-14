'use client';

import { useState } from 'react';

const testimonials = [
  {
    id: 1,
    name: 'Sarah Johnson',
    company: 'Digital Marketing Agency',
    location: 'New York, USA',
    service: 'Computer Repair',
    rating: 5,
    text: 'My laptop was completely frozen and I thought I lost everything. QuickTechPro fixed it remotely in just 2 hours and recovered all my files. Amazing service!',
    avatar: 'SJ'
  },
  {
    id: 2,
    name: 'Rajesh Sharma',
    company: 'Local Restaurant Owner',
    location: 'Mumbai, India',
    service: 'Website Design',
    rating: 5,
    text: 'They created a beautiful website for my restaurant with online ordering. Sales increased by 40% in the first month. Highly recommended!',
    avatar: 'RS'
  },
  {
    id: 3,
    name: 'Michael Chen',
    company: 'E-commerce Business',
    location: 'Singapore',
    service: 'Web Application',
    rating: 5,
    text: 'QuickTechPro built a custom inventory management system for our business. It saved us hours of manual work every day. Professional and reliable.',
    avatar: 'MC'
  },
  {
    id: 4,
    name: 'Emily Davis',
    company: 'Freelance Designer',
    location: 'London, UK',
    service: 'Computer Repair',
    rating: 5,
    text: 'Got a virus that encrypted all my design files. They removed it completely and helped me set up better security. Life saver!',
    avatar: 'ED'
  },
  {
    id: 5,
    name: 'David Kumar',
    company: 'Tech Startup',
    location: 'Bangalore, India',
    service: 'Web Application',
    rating: 5,
    text: 'Built our entire web platform from scratch. Clean code, great performance, and delivered on time. Will definitely work with them again.',
    avatar: 'DK'
  },
  {
    id: 6,
    name: 'Lisa Wang',
    company: 'Online Store',
    location: 'Toronto, Canada',
    service: 'Website Design',
    rating: 5,
    text: 'They redesigned our outdated website and made it mobile-friendly. Customer engagement improved significantly. Great attention to detail.',
    avatar: 'LW'
  }
];

const stats = [
  { number: '500+', label: 'Happy Clients' },
  { number: '1200+', label: 'Projects Completed' },
  { number: '24/7', label: 'Support Available' },
  { number: '99.9%', label: 'Uptime Guarantee' }
];

export default function TestimonialsSection() {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section id="testimonials" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-gray-900 sm:text-4xl lg:text-5xl mb-4">
            What Our Clients Say
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Real feedback from real customers who experienced our professional tech services.
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Testimonials carousel */}
        <div className="relative bg-gray-50 rounded-3xl p-8 lg:p-12">
          <div className="max-w-4xl mx-auto">
            {/* Current testimonial */}
            <div className="text-center">
              {/* Stars */}
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <svg key={i} className="h-6 w-6 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>

              {/* Testimonial text */}
              <blockquote className="text-xl lg:text-2xl text-gray-900 mb-8 leading-relaxed">
                &ldquo;{testimonials[currentTestimonial].text}&rdquo;
              </blockquote>

              {/* Author info */}
              <div className="flex items-center justify-center">
                <div className="flex-shrink-0">
                  <div className="h-12 w-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                </div>
                <div className="ml-4 text-left">
                  <div className="font-semibold text-gray-900">{testimonials[currentTestimonial].name}</div>
                  <div className="text-gray-600 text-sm">{testimonials[currentTestimonial].company}</div>
                  <div className="text-gray-500 text-sm">{testimonials[currentTestimonial].location}</div>
                </div>
                <div className="ml-6">
                  <span className="bg-blue-100 text-blue-800 text-xs font-medium px-3 py-1 rounded-full">
                    {testimonials[currentTestimonial].service}
                  </span>
                </div>
              </div>
            </div>

            {/* Navigation */}
            <div className="flex items-center justify-center mt-8 space-x-4">
              <button
                onClick={prevTestimonial}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              
              {/* Dots indicator */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentTestimonial(index)}
                    className={`w-3 h-3 rounded-full transition-all duration-200 ${
                      index === currentTestimonial ? 'bg-blue-600' : 'bg-gray-300 hover:bg-gray-400'
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={nextTestimonial}
                className="p-2 rounded-full bg-white shadow-lg hover:shadow-xl transition-all duration-200 hover:bg-gray-50"
              >
                <svg className="h-6 w-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {/* All testimonials grid */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">More Client Reviews</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.slice(0, 6).map((testimonial) => (
              <div key={testimonial.id} className="bg-white rounded-xl p-6 shadow-lg border border-gray-100">
                <div className="flex items-center mb-4">
                  <div className="h-10 w-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {testimonial.avatar}
                  </div>
                  <div className="ml-3">
                    <div className="font-semibold text-gray-900 text-sm">{testimonial.name}</div>
                    <div className="text-gray-600 text-xs">{testimonial.location}</div>
                  </div>
                  <div className="ml-auto">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                      {testimonial.service}
                    </span>
                  </div>
                </div>
                
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <svg key={i} className="h-4 w-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                
                <p className="text-gray-700 text-sm">{testimonial.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
