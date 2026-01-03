// 'use client';

// import React, { useState, useEffect, useRef } from 'react';
// import Image from 'next/image';
// import { Mic, MicOff, Send, Volume2, LogOut, Search, GraduationCap, Heart, Briefcase, Users, Home, Building2, Wallet, Baby } from 'lucide-react';
// import {
//   GoogleAuthProvider,
//   signOut
// } from "firebase/auth";
// import { useRouter } from "next/navigation";
// import { auth } from "@/lib/firebase";


// interface Scheme {
//   id: string;
//   name: string;
//   eligibility: string;
//   benefits: string;
//   applyLink: string;
//   category?: string;
// }

// export default function Page() {
//   const [isListening, setIsListening] = useState(false);
//   const [inputText, setInputText] = useState('');
//   const [schemes, setSchemes] = useState<Scheme[]>([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
//   const recognitionRef = useRef<any>(null);
//   const synthesisRef = useRef<SpeechSynthesis | null>(null);

//   const router = useRouter();
//   const handleSignOut = async () => {
//     try {
//       const provider = new GoogleAuthProvider();
//       await signOut(auth);
//       router.push("/");
//     } catch {
//       console.log("Google logout failed. Please try again.");
//     }
//   }

//   useEffect(() => {
//     if (typeof window !== 'undefined') {
//       synthesisRef.current = window.speechSynthesis;
      
//       if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
//         const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
//         recognitionRef.current = new SpeechRecognition();
//         recognitionRef.current.continuous = true;
//         recognitionRef.current.interimResults = true;
//         recognitionRef.current.lang = 'hi-IN';

//         recognitionRef.current.onresult = (event: any) => {
//           let finalTranscript = '';
//           for (let i = event.resultIndex; i < event.results.length; i++) {
//             if (event.results[i].isFinal) {
//               finalTranscript += event.results[i][0].transcript;
//             }
//           }
//           if (finalTranscript) {
//             setInputText(prev => (prev + ' ' + finalTranscript).trim());
//           }
//         };

//         recognitionRef.current.onerror = (event: any) => {
//           console.error('Speech recognition error:', event.error);
//           setIsListening(false);
//         };
//       }
//     }
//   }, []);

//   const detectLanguage = (text: string): string => {
//     const hindiPattern = /[\u0900-\u097F]/;
//     return hindiPattern.test(text) ? 'hi' : 'en';
//   };

//   const toggleListening = () => {
//     if (!recognitionRef.current) {
//       alert('Speech recognition is not supported in your browser');
//       return;
//     }

//     if (isListening) {
//       recognitionRef.current.stop();
//       setIsListening(false);
//     } else {
//       const detectedLang = detectLanguage(inputText);
//       recognitionRef.current.lang = detectedLang === 'hi' ? 'hi-IN' : 'en-IN';
//       recognitionRef.current.start();
//       setIsListening(true);
//     }
//   };

//   const speakText = (text: string, schemeId: string) => {
//     if (!synthesisRef.current) return;

//     if (synthesisRef.current.speaking) {
//       synthesisRef.current.cancel();
//       setIsSpeaking(null);
//       return;
//     }

//     const utterance = new SpeechSynthesisUtterance(text);
//     const lang = detectLanguage(text);
//     utterance.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
//     utterance.rate = 0.9;
    
//     utterance.onend = () => setIsSpeaking(null);
//     utterance.onerror = () => setIsSpeaking(null);
    
//     setIsSpeaking(schemeId);
//     synthesisRef.current.speak(utterance);
//   };

//   const handleSubmit = async () => {
//     if (!inputText.trim()) return;

//     const userMessage = inputText.trim();
//     const detectedLang = detectLanguage(userMessage);
    
//     setInputText('');
//     setIsLoading(true);
//     setSchemes([]);

//     try {
//       const response = await fetch('/api/query-schemes', {
//         method: 'POST',
//         headers: { 'Content-Type': 'application/json' },
//         body: JSON.stringify({ query: userMessage, language: detectedLang })
//       });

//       const data = await response.json();
      
//       if (data.error) {
//         throw new Error(data.error);
//       }

//       setSchemes(data.schemes || []);
//     } catch (error) {
//       console.error('Error fetching schemes:', error);
//       const errorMsg = detectedLang === 'hi' 
//         ? 'क्षमा करें, कुछ गलत हो गया। कृपया पुनः प्रयास करें।'
//         : 'Sorry, something went wrong. Please try again.';
      
//       setSchemes([{
//         id: 'error',
//         name: errorMsg,
//         eligibility: '',
//         benefits: '',
//         applyLink: ''
//       }]);
//     } finally {
//       setIsLoading(false);
//     }
//   };
//   const getCategoryIcon = (category?: string) => {
//     const iconClass = "w-10 h-10";
//     switch (category?.toLowerCase()) {
//       case 'education': return <GraduationCap className={iconClass} />;
//       case 'healthcare': return <Heart className={iconClass} />;
//       case 'employment':
//       case 'entrepreneurship': return <Briefcase className={iconClass} />;
//       case 'women': return <Users className={iconClass} />;
//       case 'housing': return <Home className={iconClass} />;
//       case 'agriculture': return <Building2 className={iconClass} />;
//       case 'banking':
//       case 'pension': return <Wallet className={iconClass} />;
//       case 'children': return <Baby className={iconClass} />;
//       default: return <Search className={iconClass} />;
//     }
//   };

//   const getCategoryColor = (category?: string) => {
//     switch (category?.toLowerCase()) {
//       case 'education': return { bg: 'from-blue-500 to-blue-600', text: 'text-blue-600' };
//       case 'healthcare': return { bg: 'from-red-500 to-red-600', text: 'text-red-600' };
//       case 'employment':
//       case 'entrepreneurship': return { bg: 'from-green-500 to-green-600', text: 'text-green-600' };
//       case 'women': return { bg: 'from-pink-500 to-pink-600', text: 'text-pink-600' };
//       case 'housing': return { bg: 'from-purple-500 to-purple-600', text: 'text-purple-600' };
//       case 'agriculture': return { bg: 'from-green-600 to-green-700', text: 'text-green-700' };
//       case 'banking':
//       case 'pension': return { bg: 'from-indigo-500 to-indigo-600', text: 'text-indigo-600' };
//       case 'children': return { bg: 'from-yellow-500 to-yellow-600', text: 'text-yellow-600' };
//       default: return { bg: 'from-gray-500 to-gray-600', text: 'text-gray-600' };
//     }
//   };

//   return (
//     <div className="min-h-screen bg-linear-to-br from-gray-50 via-blue-50 to-indigo-50">
//       {/* Header */}
//       <header className="bg-white shadow-sm sticky top-0 z-50 border-b border-gray-100">
//   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
//     <div className="flex justify-between items-center">
//       <div className="relative h-17 w-32">
//         <Image
//           src="/logo.png"
//           alt="Awaaz Logo"
//           fill
//           className="object-contain "
//           priority
//         />
//       </div>
//       <button
//         onClick={handleSignOut}
//         className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-indigo-600 text-white rounded-full hover:from-blue-700 hover:to-indigo-700 transition-all duration-200 shadow-sm hover:shadow-md font-medium text-sm"
//       >
//         <LogOut className="w-4 h-4" />
//         <span>Logout</span>
//       </button>
//     </div>
//   </div>
// </header>

//       {/* Hero Section */}
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-12">
//         <div className="text-center mb-8 md:mb-12">
//           <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight">
//             Government Schemes,<br />Simplified.
//           </h2>
//           <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
//             Bridging the gap between you and your rights using AI-powered voice navigation.
//             <br className="hidden md:block" />
//             <span className="text-orange-600 font-medium">No forms. No typing. Just speak.</span>
//           </p>
//         </div>

//         {/* Voice Input Section */}
//         <div className="max-w-4xl mx-auto mb-12">
//           <div className="bg-white rounded-3xl shadow-2xl p-6 md:p-8 border border-gray-100">
//             <div className="flex flex-col md:flex-row items-center gap-4">
//               <button
//                 onClick={toggleListening}
//                 className={`w-16 h-16 md:w-20 md:h-20 rounded-full transition-all shadow-xl flex items-center justify-center ${
//                   isListening 
//                     ? 'bg-linear-to-br from-orange-500 to-red-500 text-white animate-pulse scale-110 ring-4 ring-orange-200' 
//                     : 'bg-linear-to-br from-orange-500 to-orange-600 text-white hover:scale-105 hover:shadow-2xl'
//                 }`}
//               >
//                 {isListening ? <MicOff className="w-8 h-8 md:w-10 md:h-10" /> : <Mic className="w-8 h-8 md:w-10 md:h-10" />}
//               </button>
              
//               <input
//                 type="text"
//                 value={inputText}
//                 onChange={(e) => setInputText(e.target.value)}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Enter' && !e.shiftKey) {
//                     e.preventDefault();
//                     handleSubmit();
//                   }
//                 }}
//                 placeholder="Tell me about yourself... / अपने बारे में बताएं..."
//                 className="flex-1 text-gray-900 px-5 md:px-6 py-3 md:py-4 border-2 border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500 text-base md:text-lg transition-all"
//               />
              
//               <button
//                 onClick={handleSubmit}
//                 disabled={isLoading || !inputText.trim()}
//                 className="w-16 h-16 md:w-20 md:h-20 bg-linear-to-br from-green-500 to-green-600 text-white rounded-full hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 transition-all shadow-xl flex items-center justify-center"
//               >
//                 <Send className="w-7 h-7 md:w-9 md:h-9" />
//               </button>
//             </div>
//             <p className="text-center text-xs md:text-sm text-gray-500 mt-4">
//               🎤 Click mic to speak or type directly • माइक पर क्लिक करें या सीधे टाइप करें
//             </p>
//           </div>
//         </div>

//         {/* Loading State */}
//         {isLoading && (
//           <div className="text-center py-16">
//             <div className="inline-block">
//               <div className="w-20 h-20 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
//               <p className="mt-6 text-lg text-gray-700 font-medium animate-pulse">
//                 🔍 Searching for your schemes...
//               </p>
//             </div>
//           </div>
//         )}

//         {/* Schemes Grid */}
//         {!isLoading && schemes.length > 0 && (
//           <div className="animate-fadeIn">
//             <div className="text-center mb-10">
//               <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
//                 {schemes[0].id === 'error' || schemes[0].id === 'no-results' 
//                   ? '🔍 Search Results' 
//                   : '✨ Your Eligible Schemes'}
//               </h3>
//               <p className="text-gray-600">
//                 {schemes[0].id === 'error' || schemes[0].id === 'no-results' 
//                   ? 'Try refining your search with more details' 
//                   : `Found ${schemes.length} scheme${schemes.length > 1 ? 's' : ''} matching your profile`}
//               </p>
//             </div>
            
//             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
//               {schemes.map((scheme, index) => {
//                 const colors = getCategoryColor(scheme.category);
//                 return (
//                   <div
//                     key={scheme.id}
//                     className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-all transform hover:-translate-y-2 border border-gray-100"
//                     style={{ animationDelay: `${index * 100}ms` }}
//                   >
//                     {/* Category Header */}
//                     <div className={`bg-linear-to-r ${colors.bg} text-white p-6 relative overflow-hidden`}>
//                       <div className="absolute top-0 right-0 w-32 h-32 bg-white opacity-10 rounded-full -mr-16 -mt-16"></div>
//                       <div className="relative z-10">
//                         <div className="flex justify-between items-start mb-4">
//                           <div className="bg-white/20 p-3 rounded-xl backdrop-blur-sm">
//                             {getCategoryIcon(scheme.category)}
//                           </div>
//                           <button
//                             onClick={() => speakText(
//                               `${scheme.name}. Eligibility: ${scheme.eligibility}. Benefits: ${scheme.benefits}`,
//                               scheme.id
//                             )}
//                             className={`p-3 rounded-full transition-all ${
//                               isSpeaking === scheme.id 
//                                 ? 'bg-red-500 scale-110 animate-pulse' 
//                                 : 'bg-white/20 hover:bg-white/30 backdrop-blur-sm'
//                             }`}
//                           >
//                             <Volume2 className="w-5 h-5" />
//                           </button>
//                         </div>
//                         <h4 className="text-xl md:text-2xl font-bold leading-tight">{scheme.name}</h4>
//                         {scheme.category && (
//                           <span className="inline-block mt-2 px-3 py-1 bg-white/20 rounded-full text-xs font-medium backdrop-blur-sm">
//                             {scheme.category.toUpperCase()}
//                           </span>
//                         )}
//                       </div>
//                     </div>

//                     {/* Scheme Details */}
//                     <div className="p-6">
//                       {scheme.eligibility && (
//                         <div className="mb-5">
//                           <h5 className={`font-bold text-gray-900 mb-2 flex items-center gap-2 ${colors.text}`}>
//                             <div className={`w-2 h-2 ${colors.bg} bg-linear-to-r rounded-full`}></div>
//                             Eligibility / पात्रता
//                           </h5>
//                           <p className="text-gray-700 text-sm leading-relaxed">{scheme.eligibility}</p>
//                         </div>
//                       )}
                      
//                       {scheme.benefits && (
//                         <div className="mb-6">
//                           <h5 className={`font-bold text-gray-900 mb-2 flex items-center gap-2 ${colors.text}`}>
//                             <div className={`w-2 h-2 ${colors.bg} bg-linear-to-r rounded-full`}></div>
//                             Benefits / लाभ
//                           </h5>
//                           <p className="text-gray-700 text-sm leading-relaxed">{scheme.benefits}</p>
//                         </div>
//                       )}
                      
//                       {scheme.applyLink && scheme.id !== 'error' && scheme.id !== 'no-results' && (
//                         <a
//                           href={scheme.applyLink}
//                           target="_blank"
//                           rel="noopener noreferrer"
//                           className={`block w-full text-center bg-linear-to-r ${colors.bg} text-white px-6 py-3.5 rounded-xl font-semibold hover:shadow-lg transition-all transform hover:scale-105`}
//                         >
//                           Apply Now / आवेदन करें →
//                         </a>
//                       )}
//                     </div>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//         )}

//         {/* Empty State */}
//         {!isLoading && schemes.length === 0 && (
//           <div className="text-center py-20">
//             <div className="inline-block mb-6">
//               <div className="w-32 h-32 bg-linear-to-br from-blue-100 to-indigo-100 rounded-full flex items-center justify-center">
//                 <Search className="w-16 h-16 text-blue-600" />
//               </div>
//             </div>
//             <h3 className="text-3xl font-bold text-gray-800 mb-4">
//               Start Your Search
//             </h3>
//             <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//               Tell us about yourself using voice or text, and we'll find the government schemes you're eligible for.
//               <br />
//               <span className="text-blue-600 font-medium">For example:</span> "I am 30 years old male and want health schemes" or "मैं एक किसान हूं"
//             </p>
//           </div>
//         )}
//       </div>

//       <style jsx>{`
//         @keyframes fadeIn {
//           from {
//             opacity: 0;
//             transform: translateY(20px);
//           }
//           to {
//             opacity: 1;
//             transform: translateY(0);
//           }
//         }

//         .animate-fadeIn {
//           animation: fadeIn 0.6s ease-out;
//         }

//         .animate-fadeIn > div > div {
//           animation: fadeIn 0.8s ease-out backwards;
//         }
//       `}</style>
//     </div>
//   );
// }

'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Mic, MicOff, Send, Volume2, Search, GraduationCap, Heart, 
  Briefcase, Users, Building2, Wallet, Sparkles, Languages, 
  ArrowRight, Globe
} from 'lucide-react';
import { signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { auth } from "@/lib/firebase";

interface Scheme {
  id: string;
  name: string;
  eligibility: string;
  benefits: string;
  applyLink: string;
  category?: string;
  targetState?: string;
  schemeLevel?: string;
}

export default function Dashboard() {

  const [isListening, setIsListening] = useState(false);
  const [inputText, setInputText] = useState('');
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState<string | null>(null);
  
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<SpeechSynthesis | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      synthesisRef.current = window.speechSynthesis;
      
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        console.log('Voices loaded:', voices.length);
      };
      
      loadVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = loadVoices;
      }
      
      if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = true;
        recognitionRef.current.interimResults = true;
        recognitionRef.current.lang = 'hi-IN'; 
        recognitionRef.current.onresult = (event: any) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalTranscript += event.results[i][0].transcript;
            }
          }
          if (finalTranscript) {
            setInputText(prev => (prev + ' ' + finalTranscript).trim());
          }
        };

        recognitionRef.current.onerror = (event: any) => {
          console.error('Speech error:', event.error);
          setIsListening(false);
        };
      }
    }
  }, []);

  const detectLanguage = (text: string): string => {
    const hindiPattern = /[\u0900-\u097F]/;
    if (!hindiPattern.test(text)) return 'en';
    const bhojpuriKeywords = ['के', 'सकेला', 'बा', 'बानी', 'रहल', 'जाला', 'आवेला', 'करेला', 'खातिर', 'रउआ', 'का'];
    const hasBhojpuri = bhojpuriKeywords.some(word => text.includes(word));
    return hasBhojpuri ? 'bho' : 'hi';
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech recognition is not supported in this browser.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {

      recognitionRef.current.lang = 'hi-IN'; 
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const speakText = (text: string, schemeId: string) => {
    if (!synthesisRef.current) return;

    if (synthesisRef.current.speaking) {
      synthesisRef.current.cancel();
      setIsSpeaking(null);
      return;
    }

    const lang = detectLanguage(text);
    const utterance = new SpeechSynthesisUtterance(text);
    
    const voices = synthesisRef.current.getVoices();
    let selectedVoice = null;
    
    if (lang === 'hi' || lang === 'bho') {
      utterance.lang = 'hi-IN';
      selectedVoice = voices.find(v => v.lang === 'hi-IN') || voices.find(v => v.name.includes('Hindi'));
    } else {
      utterance.lang = 'en-IN'; 
      selectedVoice = voices.find(v => v.lang === 'en-IN') || voices.find(v => v.lang === 'en-US');
    }

    if (selectedVoice) utterance.voice = selectedVoice;
    utterance.rate = 0.9; 

    utterance.onstart = () => setIsSpeaking(schemeId);
    utterance.onend = () => setIsSpeaking(null);
    utterance.onerror = () => setIsSpeaking(null);
    
    synthesisRef.current.speak(utterance);
  };

  const handleSubmit = async (overrideText?: string) => {
    const textToSubmit = overrideText || inputText;
    if (!textToSubmit.trim()) return;

    const detectedLang = detectLanguage(textToSubmit);
    
    if(!overrideText) setInputText(''); 
    setIsLoading(true);
    setSchemes([]);

    try {
      const response = await fetch('/api/query-schemes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: textToSubmit, language: detectedLang })
      });

      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setSchemes(data.schemes || []);

    } catch (error) {
      console.error(error);
      let errorMsg = 'Sorry, something went wrong.';
      if (detectedLang === 'bho') errorMsg = 'माफ करीं, कुछ गलती हो गइल।';
      else if (detectedLang === 'hi') errorMsg = 'क्षमा करें, कुछ गलत हो गया।';
      
      setSchemes([{
        id: 'error',
        name: errorMsg,
        eligibility: '',
        benefits: '',
        applyLink: ''
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category?: string) => {
    switch (category?.toLowerCase()) {
      case 'education': return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'healthcare': return 'bg-rose-100 text-rose-700 border-rose-200';
      case 'agriculture': return 'bg-green-100 text-green-700 border-green-200';
      case 'women': return 'bg-pink-100 text-pink-700 border-pink-200';
      case 'housing': return 'bg-teal-100 text-teal-700 border-teal-200';
      case 'social security': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      default: return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  const getCategoryIcon = (category?: string) => {
    const props = { size: 20 };
    switch (category?.toLowerCase()) {
      case 'education': return <GraduationCap {...props} />;
      case 'healthcare': return <Heart {...props} />;
      case 'agriculture': return <Building2 {...props} />;
      case 'women': return <Users {...props} />;
      case 'banking': return <Wallet {...props} />;
      default: return <Briefcase {...props} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#FFFBF2] font-sans">
      
      <div className="relative bg-slate-900 pb-40 pt-16 px-4 overflow-hidden rounded-b-[3rem]">
        
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-20 pointer-events-none">
          <div className="absolute top-[-50px] right-[-50px] w-96 h-96 bg-orange-500 rounded-full blur-[100px]" />
          <div className="absolute bottom-[-50px] left-[-50px] w-96 h-96 bg-blue-500 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto text-center mt-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 leading-tight">
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-yellow-300">
                Namaste / नमस्ते / प्रणाम
              </span>
              Welcome to Awaaz
            </h1>
            
            <div className="text-slate-300 text-lg md:text-xl mb-12 max-w-3xl mx-auto space-y-2 leading-relaxed">
              <p>Ask about government schemes in your own language.</p>
              <p className="font-medium text-slate-200">सरकारी योजनाओं के बारे में अपनी भाषा में पूछें।</p>
            </div>
          </motion.div>

          <motion.div 
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-[2.5rem] p-4 shadow-2xl shadow-orange-900/30"
          >
            <div className="relative flex items-center bg-slate-50 rounded-[2rem] border-2 border-slate-200 focus-within:border-orange-400 focus-within:ring-4 focus-within:ring-orange-100 transition-all p-3">
              
              <button
                onClick={toggleListening}
                className={`flex-shrink-0 w-24 h-24 md:w-28 md:h-28 rounded-[1.5rem] flex items-center justify-center transition-all shadow-lg ${
                  isListening 
                  ? 'bg-red-500 text-white animate-pulse' 
                  : 'bg-gradient-to-br from-orange-500 to-orange-600 text-white hover:scale-105'
                }`}
              >
                {isListening ? <MicOff size={48} /> : <Mic size={48} />}
              </button>

              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
                placeholder={isListening ? "Listening... (बोलिये)" : "Type or speak here..."}
                className="flex-1 bg-transparent border-none focus:ring-0 text-xl md:text-3xl px-6 text-slate-800 placeholder:text-slate-400 h-full font-medium"
              />

              <button
                onClick={() => handleSubmit()}
                disabled={!inputText.trim() || isLoading}
                className="flex-shrink-0 w-20 h-20 mr-2 bg-slate-900 text-white rounded-[1.5rem] flex items-center justify-center hover:bg-slate-800 disabled:opacity-50 disabled:hover:bg-slate-900 transition-colors shadow-md"
              >
                {isLoading ? <span className="animate-spin text-2xl">⟳</span> : <Send size={32} />}
              </button>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center mt-6 px-2 pb-2">
              <span className="text-sm text-slate-400 uppercase font-bold tracking-wider mr-2 pt-2">Try:</span>
              <QuickChip text="Education Loan" onClick={() => handleSubmit("Education Loan details")} />
              <QuickChip text="वृद्धावस्था पेंशन" onClick={() => handleSubmit("वृद्धावस्था पेंशन के बारे में बताइये")} />
              <QuickChip text="राशन कार्ड (भोजपुरी)" onClick={() => handleSubmit("हमरा राशन कार्ड बनवावे के बा")} />
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 -mt-10 relative z-20 pb-20">
        
        {isLoading && (
          <div className="bg-white rounded-3xl p-12 text-center shadow-xl border border-orange-100 min-h-[400px] flex flex-col items-center justify-center mt-12">
            <div className="w-20 h-20 border-8 border-orange-100 border-t-orange-600 rounded-full animate-spin mb-8"></div>
            <h3 className="text-2xl font-bold text-slate-800 animate-pulse">Searching Government Database...</h3>
            <p className="text-slate-500 mt-2 text-lg">Finding the best schemes for you.</p>
          </div>
        )}

        {!isLoading && schemes.length > 0 && (
          <div className="space-y-8 mt-12">
            <div className="flex items-center justify-between mb-6 px-2">
              <h2 className="text-3xl font-bold flex items-center gap-3 text-slate-800">
                <div className="p-2 bg-yellow-100 rounded-lg text-yellow-600"><Sparkles size={24}/></div>
                Found {schemes.length} Schemes
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              <AnimatePresence>
                {schemes.map((scheme, index) => (
                  <SchemeCard 
                    key={index} 
                    scheme={scheme} 
                    index={index} 
                    onSpeak={speakText}
                    isSpeaking={isSpeaking === scheme.id}
                    getCategoryColor={getCategoryColor}
                    getCategoryIcon={getCategoryIcon}
                    detectLanguage={detectLanguage}
                  />
                ))}
              </AnimatePresence>
            </div>
          </div>
        )}

        {!isLoading && schemes.length === 0 && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
              
            <div className="lg:col-span-2 space-y-8">
              <div className="bg-white rounded-3xl p-10 shadow-lg border border-slate-100">
                <div className="flex items-center gap-4 mb-8">
                  <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                    <Languages size={32} />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-900">We speak your language</h3>
                    <p className="text-slate-500">Select your preferred way to communicate</p>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <LanguageCard lang="English" script="Hello" sub="Ask naturally" color="bg-orange-50 text-orange-800 border-orange-100" />
                  <LanguageCard lang="Hindi" script="नमस्ते" sub="हिंदी में पूछें" color="bg-green-50 text-green-800 border-green-100" />
                  <LanguageCard lang="Bhojpuri" script="प्रणाम" sub="रउआ पूछ सकत बानी" color="bg-purple-50 text-purple-800 border-purple-100" />
                </div>
              </div>

              <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-10 text-white shadow-xl relative overflow-hidden">
                <div className="relative z-10">
                  <h3 className="text-3xl font-bold mb-6">Need help getting started?</h3>
                  
                  <div className="space-y-6 mb-8">
                    {/* English */}
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-sm text-slate-400 uppercase font-bold mb-1">English</p>
                      <p className="text-lg">"I am a student from Bihar looking for a loan."</p>
                    </div>

                    {/* Hindi */}
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-sm text-slate-400 uppercase font-bold mb-1">Hindi (हिंदी)</p>
                      <p className="text-lg">"मैं बिहार का एक छात्र हूँ और मुझे लोन चाहिए।"</p>
                    </div>

                    {/* Bhojpuri */}
                    <div className="bg-white/10 p-4 rounded-xl backdrop-blur-sm border border-white/10">
                      <p className="text-sm text-slate-400 uppercase font-bold mb-1">Bhojpuri (भोजपुरी)</p>
                      <p className="text-lg">"हम बिहार के छात्र बानी, हमरा लोन चाही।"</p>
                    </div>
                  </div>

                  <button onClick={toggleListening} className="bg-white text-slate-900 px-8 py-4 rounded-full font-bold hover:bg-orange-400 hover:text-white transition-all flex items-center gap-3 text-lg shadow-lg">
                    <Mic size={24} /> Tap to Speak Now
                  </button>
                </div>
                <div className="absolute right-[-20px] bottom-[-20px] opacity-10 rotate-12">
                  <Mic size={250} />
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-lg border border-slate-100 h-fit">
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Search size={22} className="text-orange-500" /> Browse Topics
              </h3>
              <div className="space-y-4">
                <TopicRow icon={<GraduationCap size={20} />} text="Education / शिक्षा" onClick={() => handleSubmit("Education Schemes")} />
                <TopicRow icon={<Heart size={20} />} text="Health / स्वास्थ्य" onClick={() => handleSubmit("Health Schemes")} />
                <TopicRow icon={<Building2 size={20} />} text="Farming / कृषि" onClick={() => handleSubmit("Agriculture Schemes")} />
                <TopicRow icon={<Users size={20} />} text="Women / महिला" onClick={() => handleSubmit("Women Schemes")} />
                <TopicRow icon={<Wallet size={20} />} text="Pension / पेंशन" onClick={() => handleSubmit("Pension Schemes")} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}


const QuickChip = ({ text, onClick }: { text: string, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className="px-4 py-2 bg-slate-100 hover:bg-orange-100 hover:text-orange-700 text-slate-600 rounded-full text-sm font-medium transition-colors border border-slate-200 hover:border-orange-200"
  >
    {text}
  </button>
);

const LanguageCard = ({ lang, script, sub, color }: any) => (
  <div className={`p-6 rounded-2xl ${color} border hover:shadow-md transition-all cursor-default`}>
    <div className="text-3xl font-bold mb-2">{script}</div>
    <div className="font-bold text-lg opacity-90">{lang}</div>
    <div className="text-sm opacity-70 mt-1">{sub}</div>
  </div>
);

const TopicRow = ({ icon, text, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between p-4 hover:bg-orange-50 rounded-xl transition-all group text-left border border-transparent hover:border-orange-100"
  >
    <div className="flex items-center gap-4 text-slate-600 group-hover:text-orange-700 font-medium text-lg">
      <div className="bg-slate-100 p-2 rounded-lg group-hover:bg-white transition-colors">{icon}</div>
      <span>{text}</span>
    </div>
    <ArrowRight size={18} className="text-slate-300 group-hover:text-orange-500 transform group-hover:translate-x-1 transition-all"/>
  </button>
);

const SchemeCard = ({ scheme, index, onSpeak, isSpeaking, getCategoryColor, getCategoryIcon, detectLanguage }: any) => {
  const styles = getCategoryColor(scheme.category);
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="bg-white rounded-3xl shadow-md border border-slate-100 overflow-hidden hover:shadow-2xl transition-all duration-300 group flex flex-col h-full"
    >
      {/* Card Header */}
      <div className="p-8 pb-4">
        <div className="flex justify-between items-start mb-6">
          <div className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-2 uppercase tracking-wide border ${styles}`}>
            {getCategoryIcon(scheme.category)}
            {scheme.category || 'General'}
          </div>
          <button 
            onClick={() => {
              const lang = detectLanguage(scheme.name);
              let text = '';
              if (lang === 'bho') text = `${scheme.name}. एकर पात्रता बा: ${scheme.eligibility}. एकर फायदा बा: ${scheme.benefits}`;
              else if (lang === 'hi') text = `${scheme.name}. इसकी पात्रता है: ${scheme.eligibility}. इसके लाभ हैं: ${scheme.benefits}`;
              else text = `${scheme.name}. Eligibility is: ${scheme.eligibility}. Benefits are: ${scheme.benefits}`;
              
              onSpeak(text, scheme.id);
            }}
            className={`p-3 rounded-full transition-all shadow-sm ${isSpeaking ? 'bg-orange-500 text-white animate-pulse' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'}`}
          >
            {isSpeaking ? <Volume2 size={22} /> : <Volume2 size={22} />}
          </button>
        </div>
        <h3 className="text-2xl font-bold text-slate-900 leading-tight mb-2 group-hover:text-orange-600 transition-colors">
          {scheme.name}
        </h3>
        {scheme.targetState && (
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
            <Globe size={14} /> {scheme.targetState}
          </span>
        )}
      </div>

      {/* Card Body */}
      <div className="px-8 py-6 border-t border-slate-50 bg-slate-50/50 flex-grow space-y-6">
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Eligibility / पात्रता</h4>
          <p className="text-slate-700 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
            {scheme.eligibility}
          </p>
        </div>
        <div>
          <h4 className="text-xs font-bold text-slate-400 uppercase mb-2 tracking-widest">Benefits / लाभ</h4>
          <p className="text-slate-700 leading-relaxed line-clamp-3 hover:line-clamp-none transition-all">
            {scheme.benefits}
          </p>
        </div>
      </div>

      {/* Card Footer */}
      <div className="p-6 bg-white border-t border-slate-100">
        <a 
          href={scheme.applyLink} 
          target="_blank" 
          rel="noreferrer"
          className="flex items-center justify-center gap-2 w-full py-4 rounded-xl bg-slate-900 text-white font-bold text-lg hover:bg-orange-600 transition-colors shadow-lg hover:shadow-orange-500/30"
        >
          Apply Now <ArrowRight size={20} />
        </a>
      </div>
    </motion.div>
  );
};