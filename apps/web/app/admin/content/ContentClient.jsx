"use client";

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { AdminAPI } from '../../lib/adminApi';
import BlogManager from './BlogManager';
import {
  Card,
  Button,
  PageHeader,
  EmptyState,
  LoadingSpinner,
  Tabs,
} from '../components/ui';

const TABS = [
  { id: 'blog', label: 'Blog Posts' },
  { id: 'testimonials', label: 'Testimonials' },
];

export default function ContentClient() {
  const [activeTab, setActiveTab] = useState('blog');
  const [testimonials, setTestimonials] = useState([]);
  const [loadingTestimonials, setLoadingTestimonials] = useState(false);
  const [testimonialsError, setTestimonialsError] = useState(null);
  const [approvingId, setApprovingId] = useState(null);
  const [rejectingId, setRejectingId] = useState(null);

  const loadTestimonials = useCallback(async () => {
    setLoadingTestimonials(true);
    setTestimonialsError(null);

    try {
      const response = await AdminAPI.testimonials(false);
      const items = Array.isArray(response?.items)
        ? response.items
        : Array.isArray(response?.data)
        ? response.data
        : [];
      setTestimonials(items);
    } catch (error) {
      console.error('Error loading testimonials', error);
      setTestimonialsError(error);
    } finally {
      setLoadingTestimonials(false);
    }
  }, []);

  useEffect(() => {
    if (activeTab === 'testimonials') {
      loadTestimonials();
    }
  }, [activeTab, loadTestimonials]);

  const handleApprove = async (id) => {
    setApprovingId(id);
    try {
      await AdminAPI.testimonialApprove(id, true);
      toast.success('Testimonial approved');
      await loadTestimonials();
    } catch (error) {
      console.error('Error approving testimonial', error);
      toast.error('Unable to approve testimonial. Please try again.');
    } finally {
      setApprovingId(null);
    }
  };
  const handleReject = async (id) => {
    setRejectingId(id);
    try {
      await AdminAPI.testimonialReject(id);
      toast.success('Testimonial rejected');
      await loadTestimonials();
    } catch (error) {
      console.error('Error rejecting testimonial', error);
      toast.error('Unable to reject testimonial. Please try again.');
    } finally {
      setRejectingId(null);
    }
  };

  const renderTestimonials = () => {
    if (loadingTestimonials) {
      return (
        <Card>
          <div className="py-12">
            <LoadingSpinner size="lg" />
          </div>
        </Card>
      );
    }

    if (testimonialsError) {
      return (
        <Card>
          <div className="space-y-3 p-4">
            <p className="text-sm text-red-600">
              We could not load testimonials right now. Please try again.
            </p>
            <Button variant="primary" onClick={loadTestimonials} size="sm">
              Retry
            </Button>
          </div>
        </Card>
      );
    }

    if (testimonials.length === 0) {
      return (
        <Card>
          <EmptyState
            title="No pending testimonials"
            description="All testimonials have been moderated."
            icon={
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            }
          />
        </Card>
      );
    }

    return (
      <Card title="Pending testimonials">
        <div className="space-y-4">
          {testimonials.map((testimonial) => {
            const isApproving = approvingId === testimonial.id;
            const isRejecting = rejectingId === testimonial.id;
            const isBusy = isApproving || isRejecting;

            return (
              <div
                key={testimonial.id}
                className="rounded-lg border border-gray-200 bg-gray-50 p-5"
              >
                <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="text-lg font-medium text-gray-900">
                        {testimonial.author || 'Anonymous'}
                      </h3>
                      {testimonial.rating != null && (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-800">
                          {testimonial.rating}
                          <svg
                            className="ml-1 h-3 w-3 text-yellow-600"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path d="M9.049 2.927a1 1 0 011.902 0l1.286 3.955 4.163.012a1 1 0 01.588 1.806l-3.36 2.438 1.257 3.977a1 1 0 01-1.536 1.118L10 13.347l-3.349 2.886a1 1 0 01-1.536-1.118l1.257-3.977-3.36-2.438a1 1 0 01.588-1.806l4.163-.012 1.286-3.955z" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600">{testimonial.content}</p>
                    {testimonial.serviceName && (
                      <div className="text-xs text-gray-500">
                        Service: {testimonial.serviceName}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-2 md:flex-col md:items-end md:gap-3">
                    <Button
                      size="sm"
                      variant="danger"
                      className="w-28"
                      onClick={() => handleReject(testimonial.id)}
                      disabled={isBusy}
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      }
                    >
                      {isRejecting ? 'Rejecting...' : 'Reject'}
                    </Button>
                    <Button
                      size="sm"
                      variant="success"
                      className="w-28"
                      onClick={() => handleApprove(testimonial.id)}
                      disabled={isBusy}
                      icon={
                        <svg
                          className="h-4 w-4"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M5 13l4 4L19 7"
                          />
                        </svg>
                      }
                    >
                      {isApproving ? 'Approving...' : 'Approve'}
                    </Button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    );
  };

  return (
    <div className="pb-6">
      <PageHeader
        title="Content Moderation"
        description="Manage and moderate blog posts and testimonials"
        actions={
          <div className="flex space-x-3">
            <Link href="/admin/content/analytics">
              <Button variant="secondary" size="sm">
                View analytics
              </Button>
            </Link>
            <Link href="/admin/content/subscribers">
              <Button variant="secondary" size="sm">
                Manage subscribers
              </Button>
            </Link>
            <Link href="/admin/content/blog/new">
              <Button
                variant="secondary"
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                    />
                  </svg>
                }
              >
                New Blog Post
              </Button>
            </Link>
            <Link href="/admin/content/testimonials/new">
              <Button
                variant="primary"
                icon={
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"
                    />
                  </svg>
                }
              >
                Add Testimonial
              </Button>
            </Link>
          </div>
        }
      />

      <Card className="mb-6">
        <Tabs tabs={TABS} activeTab={activeTab} onChange={setActiveTab} />
      </Card>

      {activeTab === 'blog' ? <BlogManager /> : renderTestimonials()}
    </div>
  );
}


