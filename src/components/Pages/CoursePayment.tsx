import { useState } from 'react';
import { CreditCard, Smartphone, Check, Sparkles, ArrowRight, Shield, Clock, Award } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface CoursePaymentProps {
  courseId: string;
  onBack: () => void;
  onSuccess?: () => void;
}

// Sample course data - in real app, this would come from props or API
const courseInfo: Record<string, any> = {
  'PY-001': {
    title: 'COMPLETE PYTHON BOOTCAMP',
    category: 'Programming Languages',
    instructor: 'Dr. Sarah Johnson',
    price: '$49.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '40 hours',
    students: '15.2K',
  },
  'FS-002': {
    title: 'FULL STACK DEVELOPMENT',
    category: 'Development',
    instructor: 'Mark Thompson',
    price: '$79.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '60 hours',
    students: '12.8K',
  },
  'DS-003': {
    title: 'DATA STRUCTURES & ALGORITHMS',
    category: 'DSA / Placements',
    instructor: 'Prof. Michael Chen',
    price: '$59.99',
    thumbnail: 'https://images.unsplash.com/photo-1759884248009-92c5e957708e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvbmxpbmUlMjBjb3Vyc2UlMjBjb2Rpbmd8ZW58MXx8fHwxNzY4OTkyMzIyfDA&ixlib=rb-4.1.0&q=80&w=1080',
    duration: '50 hours',
    students: '18.4K',
  },
};

export function CoursePayment({ courseId, onBack, onSuccess }: CoursePaymentProps) {
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'wallet'>('card');
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    cardholderName: '',
    cardNumber: '',
    expiryDate: '',
    cvv: '',
  });

  const course = courseInfo[courseId] || courseInfo['PY-001'];

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

  const handlePurchase = (e: React.FormEvent) => {
    e.preventDefault();
    // Show success modal
    setShowSuccess(true);
  };

  const handleSuccessAction = (action: 'courses' | 'learn') => {
    setShowSuccess(false);
    if (onSuccess) {
      onSuccess();
    } else {
      onBack();
    }
  };

  return (
    <div className="min-h-screen bg-[#0b0b0b] relative">
      {/* Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(172,186,196,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(172,186,196,0.03)_1px,transparent_1px)] bg-[size:50px_50px] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,black,transparent)]"></div>
      
      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <button
          onClick={onBack}
          className="mb-8 text-[#ACBAC4]/70 hover:text-[#ACBAC4] transition-colors text-sm font-mono flex items-center space-x-2"
        >
          <span>←</span>
          <span>BACK_TO_COURSE</span>
        </button>

        {/* Page Header */}
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-4 tracking-tight">
            Complete Your Enrollment
          </h1>
          <p className="text-gray-400/90 text-lg">
            Secure payment to access this course instantly
          </p>
        </div>

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Course Summary - Left Side */}
          <div className="lg:col-span-1">
            <div className="bg-[#121212]/80 backdrop-blur-sm border border-[#ACBAC4]/20 rounded-xl p-6 sticky top-8">
              <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-4 tracking-widest">
                // ORDER SUMMARY
              </h3>

              {/* Course Thumbnail */}
              <div className="relative h-40 rounded-lg overflow-hidden mb-4 bg-gradient-to-br from-[#ACBAC4]/10 to-transparent">
                <img 
                  src={course.thumbnail} 
                  alt={course.title}
                  className="w-full h-full object-cover opacity-60"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121212] to-transparent"></div>
              </div>

              {/* Course Info */}
              <div className="space-y-3 mb-6">
                <div>
                  <div className="text-xs text-[#ACBAC4]/70 font-mono mb-1">{course.category}</div>
                  <h4 className="text-lg font-bold text-white">{course.title}</h4>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-400">
                  <span>by</span>
                  <span className="text-[#ACBAC4]/90">{course.instructor}</span>
                </div>

                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{course.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Award className="w-3 h-3" />
                    <span>Certificate</span>
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="border-t border-[#ACBAC4]/20 pt-4 mb-4">
                <div className="flex items-baseline justify-between">
                  <span className="text-gray-400 text-sm">Course Price</span>
                  <span className="text-3xl font-bold text-[#ACBAC4]">{course.price}</span>
                </div>
              </div>

              {/* Benefits */}
              <div className="space-y-2 bg-[#ACBAC4]/5 rounded-lg p-4 border border-[#ACBAC4]/10">
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#ACBAC4]" />
                  <span>Lifetime access</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#ACBAC4]" />
                  <span>All course materials</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#ACBAC4]" />
                  <span>Certificate of completion</span>
                </div>
                <div className="flex items-center space-x-2 text-sm text-gray-300">
                  <Check className="w-4 h-4 text-[#ACBAC4]" />
                  <span>24/7 support access</span>
                </div>
              </div>
            </div>
          </div>

          {/* Payment Form - Right Side */}
          <div className="lg:col-span-2">
            <form onSubmit={handlePurchase} className="bg-[#121212]/80 backdrop-blur-sm border border-[#ACBAC4]/20 rounded-xl p-6 md:p-8">
              <h3 className="text-xs font-mono text-[#ACBAC4]/70 mb-6 tracking-widest">
                // PAYMENT DETAILS
              </h3>

              {/* Payment Method Selection */}
              <div className="mb-8">
                <label className="block text-sm text-gray-300 mb-3">Payment Method</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-4 rounded-lg border transition-all flex items-center justify-center space-x-3 ${
                      paymentMethod === 'card'
                        ? 'bg-[#ACBAC4]/10 border-[#ACBAC4] text-[#ACBAC4]'
                        : 'bg-[#0b0b0b]/50 border-[#ACBAC4]/20 text-gray-400 hover:border-[#ACBAC4]/40'
                    }`}
                  >
                    <CreditCard className="w-5 h-5" />
                    <span className="font-medium">Card</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('wallet')}
                    className={`p-4 rounded-lg border transition-all flex items-center justify-center space-x-3 ${
                      paymentMethod === 'wallet'
                        ? 'bg-[#ACBAC4]/10 border-[#ACBAC4] text-[#ACBAC4]'
                        : 'bg-[#0b0b0b]/50 border-[#ACBAC4]/20 text-gray-400 hover:border-[#ACBAC4]/40'
                    }`}
                  >
                    <Smartphone className="w-5 h-5" />
                    <span className="font-medium">Wallet</span>
                  </button>
                </div>
              </div>

              {/* Card Payment Form */}
              {paymentMethod === 'card' && (
                <div className="space-y-6">
                  {/* Cardholder Name */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Cardholder Name</label>
                    <input
                      type="text"
                      name="cardholderName"
                      value={formData.cardholderName}
                      onChange={handleInputChange}
                      placeholder="John Doe"
                      required
                      className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all"
                    />
                  </div>

                  {/* Card Number */}
                  <div>
                    <label className="block text-sm text-gray-300 mb-2">Card Number</label>
                    <input
                      type="text"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={handleInputChange}
                      placeholder="1234 5678 9012 3456"
                      maxLength={19}
                      required
                      className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono"
                    />
                  </div>

                  {/* Expiry and CVV */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">Expiry Date</label>
                      <input
                        type="text"
                        name="expiryDate"
                        value={formData.expiryDate}
                        onChange={handleInputChange}
                        placeholder="MM/YY"
                        maxLength={5}
                        required
                        className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-sm text-gray-300 mb-2">CVV</label>
                      <input
                        type="text"
                        name="cvv"
                        value={formData.cvv}
                        onChange={handleInputChange}
                        placeholder="123"
                        maxLength={3}
                        required
                        className="w-full bg-[#0b0b0b]/80 border border-[#ACBAC4]/30 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-[#ACBAC4] focus:ring-1 focus:ring-[#ACBAC4]/50 transition-all font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Wallet Payment (Placeholder) */}
              {paymentMethod === 'wallet' && (
                <div className="space-y-4">
                  <div className="text-center py-12 border-2 border-dashed border-[#ACBAC4]/20 rounded-lg">
                    <Smartphone className="w-12 h-12 mx-auto mb-4 text-[#ACBAC4]/50" />
                    <p className="text-gray-400 mb-2">Mobile Wallet Payment</p>
                    <p className="text-sm text-gray-500">Select your preferred wallet provider</p>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {['bKash', 'Nagad', 'Rocket'].map(wallet => (
                      <button
                        key={wallet}
                        type="button"
                        className="p-3 bg-[#0b0b0b]/80 border border-[#ACBAC4]/20 rounded-lg text-sm text-gray-400 hover:border-[#ACBAC4]/40 hover:text-[#ACBAC4] transition-all"
                      >
                        {wallet}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Security Notice */}
              <div className="mt-8 flex items-start space-x-3 bg-[#ACBAC4]/5 border border-[#ACBAC4]/10 rounded-lg p-4">
                <Shield className="w-5 h-5 text-[#ACBAC4] flex-shrink-0 mt-0.5" />
                <div className="text-sm text-gray-400">
                  <p className="font-medium text-gray-300 mb-1">Secure Payment</p>
                  <p className="text-xs">Your payment information is encrypted and secure. We never store your card details.</p>
                </div>
              </div>

              {/* Purchase Button */}
              <button
                type="submit"
                className="w-full mt-8 bg-[#ACBAC4]/80 hover:bg-[#ACBAC4] text-black font-bold py-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group relative overflow-hidden"
              >
                <span className="relative z-10">Purchase Now - {course.price}</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform relative z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#ACBAC4] to-[#8CA0AA] opacity-0 group-hover:opacity-100 transition-opacity"></div>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <AnimatePresence>
        {showSuccess && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40"
              onClick={() => setShowSuccess(false)}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
            >
              <div className="bg-[#121212]/95 backdrop-blur-md border border-[#ACBAC4]/30 rounded-2xl p-8 md:p-12 max-w-md w-full relative overflow-hidden">
                {/* Glow Effect */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-64 bg-[#ACBAC4]/20 rounded-full blur-3xl -z-10"></div>

                {/* Success Icon with Animation */}
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: 'spring', damping: 15 }}
                  className="w-20 h-20 mx-auto mb-6 bg-[#ACBAC4]/20 rounded-full flex items-center justify-center relative"
                >
                  <div className="w-16 h-16 bg-[#ACBAC4] rounded-full flex items-center justify-center">
                    <Check className="w-10 h-10 text-black" strokeWidth={3} />
                  </div>
                  {/* Sparkles */}
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity, ease: 'linear' },
                      scale: { duration: 2, repeat: Infinity }
                    }}
                    className="absolute inset-0"
                  >
                    <Sparkles className="w-6 h-6 text-[#ACBAC4] absolute -top-2 -right-2" />
                    <Sparkles className="w-4 h-4 text-[#ACBAC4]/60 absolute -bottom-1 -left-1" />
                  </motion.div>
                </motion.div>

                {/* Success Message */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-center mb-8"
                >
                  <h2 className="text-3xl font-bold text-white mb-3">Payment Successful!</h2>
                  <p className="text-gray-400 text-lg mb-2">You are now enrolled in</p>
                  <p className="text-[#ACBAC4] font-semibold">{course.title}</p>
                </motion.div>

                {/* Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="space-y-3"
                >
                  <button
                    onClick={() => handleSuccessAction('learn')}
                    className="w-full bg-[#ACBAC4] hover:bg-[#ACBAC4]/90 text-black font-bold py-3 rounded-lg transition-all flex items-center justify-center space-x-2"
                  >
                    <span>Start Learning</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => handleSuccessAction('courses')}
                    className="w-full bg-transparent border border-[#ACBAC4]/40 text-[#ACBAC4] hover:bg-[#ACBAC4]/10 font-medium py-3 rounded-lg transition-all"
                  >
                    Go to My Courses
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