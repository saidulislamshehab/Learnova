import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CreditCard, Smartphone, Check, Sparkles, ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePaymentProps {
  onBack: () => void;
  onSuccess?: () => void;
}

interface Course {
  CourseID: number;
  Title: string;
  Category: string;
  Description: string;
  Price: string | number;
  Thumbnail: string | null;
  Total_Hours: string | number | null;
  Instructor_Name?: string;
  user?: {
    name: string;
  };
}

export function CoursePayment({ onBack, onSuccess }: CoursePaymentProps) {
  const { id } = useParams<{ id: string }>();
  
  const [course, setCourse] = useState<Course | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  useEffect(() => {
    const fetchCourse = async () => {
      if (!id) {
        setError('No course ID provided');
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const response = await axios.get(`http://${window.location.hostname}:8000/api/courses/${id}`);
        setCourse(response.data.course);
      } catch (err) {
        setError('Failed to fetch course details');
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Format card number with spaces
    if (name === 'cardNumber') {
      const formatted = value.replace(/\s/g, '').replace(/(\d{4})/g, '$1 ').trim();
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Format expiry date
    else if (name === 'expiryDate') {
      const formatted = value.replace(/\D/g, '').replace(/(\d{2})(\d)/, '$1/$2').substring(0, 5);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    // Limit CVV to 3 digits
    else if (name === 'cvv') {
      const formatted = value.replace(/\D/g, '').substring(0, 3);
      setFormData(prev => ({ ...prev, [name]: formatted }));
    }
    else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handlePurchase = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course) return;

    try {
      const token = localStorage.getItem('auth_token');
      if (!token) {
        alert('Please login to enroll.');
        return;
      }

      setLoading(true);
      const response = await axios.post(`http://${window.location.hostname}:8000/api/courses/enroll`, {
        course_id: id,
        payment_method: paymentMethod,
        amount_paid: course.Price,
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (response.status === 201) {
        setShowSuccess(true);
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Enrollment failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleSuccessAction = () => {
    setShowSuccess(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#ACBAC4] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen bg-[#0b0b0b] flex flex-col items-center justify-center p-4">
        <p className="text-red-400 mb-6 font-mono uppercase tracking-widest">{error || 'COURSE NOT FOUND'}</p>
        <button onClick={onBack} className="text-[#ACBAC4] hover:underline font-mono text-sm uppercase">
          ← BACK_TO_CATALOG
        </button>
      </div>
    );
  }

  const defaultThumb = 'https://res.cloudinary.com/dp1li5tkd/image/upload/v1775459948/eg8mybzg20bdnsau78vs.jpg';
  const instructor = course.user?.name || course.Instructor_Name || 'Expert Academic';

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative">
      <div className="absolute inset-0 bg-[linear-gradient(rgba(172,186,196,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(172,186,196,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-12">
        {/* Back Button - Fixed position with pt-32 */}
        <button
          onClick={onBack}
          className="mb-8 text-[#ACBAC4]/70 hover:text-[#ACBAC4] transition-colors text-sm font-mono flex items-center space-x-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span>
          <span>BACK_TO_COURSE</span>
        </button>

        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Complete Your Enrollment
          </h1>
          <p className="text-gray-400/90 text-lg">
            Secure payment to access this course instantly
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <div className="bg-[#121212]/80 backdrop-blur-sm border border-[#ACBAC4]/20 rounded-xl p-6 sticky top-32">
              <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-4 tracking-widest">// ORDER SUMMARY</h3>

              <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-[#ACBAC4]/10 to-transparent">
                <img 
                  src={course.Thumbnail || defaultThumb} 
                  alt={course.Title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>

              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-xs text-[#ACBAC4]/70 font-mono mb-1">{course.Category}</div>
                  <h4 className="text-lg font-bold text-white line-clamp-2 uppercase tracking-tight">{course.Title}</h4>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>by</span>
                  <span className="text-[#ACBAC4]/90">{instructor}</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.Total_Hours ? `${course.Total_Hours} hours` : 'TBD'}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>

              <div className="border-t border-[#ACBAC4]/20 pt-4 mb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-400 text-sm">Course Price</span>
                  <span className="text-3xl font-bold text-[#ACBAC4]">${course.Price}</span>
                </div>
              </div>

              <div className="space-y-2 bg-[#ACBAC4]/5 rounded-lg p-4 border border-[#ACBAC4]/10 text-[xs]">
                {[
                  'Lifetime access',
                  'All course materials',
                  'Certificate of completion',
                  '24/7 support access'
                ].map((benefit) => (
                  <div key={benefit} className="flex items-center space-x-2 text-xs text-gray-400 font-mono tracking-tighter">
                    <Check className="w-3 h-3 text-[#ACBAC4]" />
                    <span>{benefit.toUpperCase()}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-2">
            <form onSubmit={handlePurchase} className="bg-[#121212]/80 backdrop-blur-sm border border-[#ACBAC4]/20 rounded-xl p-6 md:p-8">
              <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-6 tracking-widest">// PAYMENT DETAILS</h3>

              <div className="mb-8">
                <label className="block text-sm text-gray-300 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  {(['card', 'wallet'] as const).map((method) => (
                    <button
                      key={method}
                      type="button"
                      onClick={() => setPaymentMethod(method)}
                      className={`p-4 rounded-lg border transition-all flex items-center justify-center space-x-3 uppercase text-xs font-mono tracking-widest ${
                        paymentMethod === method
                          ? 'bg-[#ACBAC4]/10 border-[#ACBAC4] text-[#ACBAC4]'
                          : 'bg-[#0b0b0b]/50 border-[#ACBAC4]/20 text-gray-500 hover:border-[#ACBAC4]/40'
                      }`}
                    >
                      {method === 'card' ? <CreditCard className="w-4 h-4" /> : <Smartphone className="w-4 h-4" />}
                      <span>{method}</span>
                    </button>
                  ))}
                </div>
              </div>

              {paymentMethod === 'card' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="JOHN DOE"
                      className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all uppercase text-sm font-mono"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-mono uppercase text-gray-500 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono tracking-[0.2em]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-500 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono uppercase text-gray-500 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                        className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-600 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'wallet' && (
                <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                  <div className="text-center py-12 border-2 border-dashed border-[#ACBAC4]/10 rounded-lg">
                    <Smartphone className="w-10 h-10 mx-auto mb-4 text-[#ACBAC4]/30" />
                    <p className="text-xs font-mono text-gray-500 uppercase tracking-widest">Select Provider</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['bKash', 'Nagad', 'Rocket'].map(wallet => (
                      <button
                        key={wallet}
                        type="button"
                        className="p-3 bg-[#0b0b0b]/80 border border-[#ACBAC4]/20 rounded-lg text-xs font-mono text-gray-500 hover:border-[#ACBAC4]/50 hover:text-[#ACBAC4] transition-all uppercase tracking-tighter"
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-8 flex items-start space-x-3 bg-[#ACBAC4]/5 border border-[#ACBAC4]/10 rounded-lg p-4">
                <Shield className="w-4 h-4 text-[#ACBAC4] flex-shrink-0 mt-0.5" />
                <div className="text-[10px] text-gray-500 font-mono uppercase leading-relaxed">
                  <p className="font-bold text-gray-400 mb-1">Secure Transaction Protocol</p>
                  <p>Your payment information is encrypted via high-level security layers. We do not persist sensitive financial data.</p>
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-8 bg-[#ACBAC4]/80 hover:bg-[#ACBAC4] text-black font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-3 group relative overflow-hidden uppercase tracking-[0.2em] text-sm"
              >
                <span className="relative z-10">Purchase Now - ${course.Price}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ACBAC4] to-[#8CA0AA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {showSuccess && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowSuccess(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-[#121212]/95 backdrop-blur-md border border-[#ACBAC4]/30 rounded-2xl p-8 md:p-12 max-w-md w-full relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ACBAC4]/20 rounded-full blur-3xl -z-10"></div>

                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-[#ACBAC4]/20 rounded-full flex items-center justify-center relative"
                >
                  <div className="w-16 h-16 bg-[#ACBAC4] rounded-full flex items-center justify-center border-4 border-black/10">
                    <Check className="w-10 h-10 text-black" strokeWidth={3} />
                  </div>
                  <motion.div
                    animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                    transition={{ rotate: { duration: 4, repeat: Infinity, ease: 'linear' }, scale: { duration: 2, repeat: Infinity } }}
                    className="absolute inset-0"
                  >
                    <Sparkles className="w-6 h-6 text-[#ACBAC4] absolute -top-2 -right-2" />
                    <Sparkles className="w-4 h-4 text-[#ACBAC4]/60 absolute -bottom-1 -left-1" />
                  </motion.div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
                  <p className="text-gray-400 text-lg mb-2">You are now enrolled in</p>
                  <p className="text-[#ACBAC4] font-mono uppercase tracking-tight font-bold">{course.Title}</p>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-4"
                >
                  <button
                    onClick={handleSuccessAction}
                    className="w-full bg-[#ACBAC4] hover:bg-[#ACBAC4]/90 text-black font-bold py-4 rounded-lg transition-all flex items-center justify-center space-x-3 uppercase tracking-widest text-xs"
                  >
                    <span>START_LEARNING</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={onBack}
                    className="w-full bg-transparent border border-[#ACBAC4]/40 text-[#ACBAC4] hover:bg-[#ACBAC4]/10 font-mono py-3 rounded-lg transition-all uppercase tracking-widest text-[10px]"
                  >
                    Return to Catalog
                  </button>
                </motion.div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}