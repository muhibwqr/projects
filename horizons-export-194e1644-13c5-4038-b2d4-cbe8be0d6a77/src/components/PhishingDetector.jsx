
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Shield, AlertTriangle, Mail, Zap, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { toast } from '@/components/ui/use-toast';

const PhishingDetector = () => {
  const [email, setEmail] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);
  const [confidence, setConfidence] = useState(0);

  const phishingIndicators = [
    'urgent action required',
    'verify your account',
    'click here immediately',
    'suspended account',
    'confirm your identity',
    'limited time offer',
    'act now',
    'congratulations you have won',
    'free money',
    'nigerian prince',
    'inheritance',
    'lottery winner',
    'tax refund',
    'security alert',
    'unusual activity'
  ];

  const analyzeEmail = async () => {
    if (!email.trim()) {
      toast({
        title: "Oops!",
        description: "Please enter an email to analyze.",
        variant: "destructive"
      });
      return;
    }

    setIsAnalyzing(true);
    setResult(null);

    // Simulate analysis delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    const emailLower = email.toLowerCase();
    let suspiciousCount = 0;
    let detectedIndicators = [];

    // Check for phishing indicators
    phishingIndicators.forEach(indicator => {
      if (emailLower.includes(indicator)) {
        suspiciousCount++;
        detectedIndicators.push(indicator);
      }
    });

    // Additional checks
    const hasMultipleExclamations = (email.match(/!/g) || []).length > 3;
    const hasAllCaps = /[A-Z]{10,}/.test(email);
    const hasSuspiciousLinks = /bit\.ly|tinyurl|t\.co/.test(emailLower);
    const hasUrgentWords = /urgent|immediate|asap|expire/i.test(email);

    if (hasMultipleExclamations) {
      suspiciousCount++;
      detectedIndicators.push('excessive exclamation marks');
    }
    if (hasAllCaps) {
      suspiciousCount++;
      detectedIndicators.push('excessive capital letters');
    }
    if (hasSuspiciousLinks) {
      suspiciousCount++;
      detectedIndicators.push('suspicious shortened links');
    }
    if (hasUrgentWords) {
      suspiciousCount++;
      detectedIndicators.push('urgent language');
    }

    const isPhishing = suspiciousCount >= 2;
    const confidenceLevel = Math.min(95, Math.max(15, suspiciousCount * 25 + Math.random() * 20));

    setResult({
      isPhishing,
      indicators: detectedIndicators,
      suspiciousCount
    });
    setConfidence(confidenceLevel);
    setIsAnalyzing(false);

    toast({
      title: isPhishing ? "⚠️ Phishing Detected!" : "✅ Email Looks Safe",
      description: isPhishing 
        ? `Found ${suspiciousCount} suspicious indicators`
        : "No major phishing indicators detected",
      variant: isPhishing ? "destructive" : "default"
    });
  };

  const clearAnalysis = () => {
    setEmail('');
    setResult(null);
    setConfidence(0);
  };

  return (
    <div className="min-h-screen gradient-bg p-4 flex items-center justify-center">
      <div className="w-full max-w-4xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="flex items-center justify-center mb-4">
            <Shield className="w-12 h-12 text-white mr-3 floating-animation" />
            <h1 className="text-4xl font-bold text-white">PhishGuard AI</h1>
          </div>
          <p className="text-xl text-white/80">
            Advanced Email Phishing Detection System
          </p>
        </motion.div>

        {/* Main Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="glass-effect border-white/20 glow-effect">
            <CardHeader>
              <CardTitle className="flex items-center text-white">
                <Mail className="w-6 h-6 mr-2" />
                Email Analysis
              </CardTitle>
              <CardDescription className="text-white/70">
                Paste your email content below to check for phishing indicators
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Email Input */}
              <div className="space-y-2">
                <label className="text-sm font-medium text-white">
                  Email Content
                </label>
                <Textarea
                  placeholder="Paste the email content here..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="min-h-[200px] bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Button
                  onClick={analyzeEmail}
                  disabled={isAnalyzing}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-3"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    <>
                      <Zap className="w-4 h-4 mr-2" />
                      Analyze Email
                    </>
                  )}
                </Button>
                <Button
                  onClick={clearAnalysis}
                  variant="outline"
                  className="border-white/20 text-white hover:bg-white/10"
                >
                  Clear
                </Button>
              </div>

              {/* Analysis Results */}
              <AnimatePresence>
                {isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="analyzing-gradient rounded-lg p-6 text-center"
                  >
                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-3 text-orange-600" />
                    <p className="text-orange-800 font-medium">
                      Analyzing email for phishing indicators...
                    </p>
                  </motion.div>
                )}

                {result && !isAnalyzing && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`rounded-lg p-6 ${
                      result.isPhishing 
                        ? 'phishing-gradient danger-glow' 
                        : 'safe-gradient safe-glow'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center">
                        {result.isPhishing ? (
                          <XCircle className="w-8 h-8 text-white mr-3" />
                        ) : (
                          <CheckCircle className="w-8 h-8 text-white mr-3" />
                        )}
                        <div>
                          <h3 className="text-xl font-bold text-white">
                            {result.isPhishing ? 'Phishing Detected!' : 'Email Appears Safe'}
                          </h3>
                          <p className="text-white/80">
                            Confidence: {confidence.toFixed(1)}%
                          </p>
                        </div>
                      </div>
                      <Badge 
                        variant={result.isPhishing ? "destructive" : "default"}
                        className="text-sm px-3 py-1"
                      >
                        {result.isPhishing ? 'HIGH RISK' : 'LOW RISK'}
                      </Badge>
                    </div>

                    {result.indicators.length > 0 && (
                      <div className="space-y-3">
                        <h4 className="font-semibold text-white flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-2" />
                          Detected Indicators ({result.indicators.length})
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {result.indicators.map((indicator, index) => (
                            <Badge
                              key={index}
                              variant="outline"
                              className="bg-white/20 text-white border-white/30"
                            >
                              {indicator}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="mt-4 p-3 bg-white/10 rounded-lg">
                      <p className="text-sm text-white/90">
                        {result.isPhishing 
                          ? '⚠️ This email shows signs of phishing. Do not click any links or provide personal information.'
                          : '✅ This email appears legitimate, but always exercise caution with sensitive information.'
                        }
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </CardContent>
          </Card>
        </motion.div>

        {/* Info Cards */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid md:grid-cols-2 gap-6 mt-8"
        >
          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <Shield className="w-5 h-5 mr-2" />
                How It Works
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Scans for common phishing keywords</li>
                <li>• Analyzes suspicious formatting patterns</li>
                <li>• Detects urgent language tactics</li>
                <li>• Identifies shortened/suspicious links</li>
                <li>• Provides confidence scoring</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="glass-effect border-white/20">
            <CardHeader>
              <CardTitle className="text-white flex items-center">
                <AlertTriangle className="w-5 h-5 mr-2" />
                Stay Safe
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-white/80 text-sm">
                <li>• Never click suspicious links</li>
                <li>• Verify sender identity independently</li>
                <li>• Don't share personal information</li>
                <li>• Check URLs carefully before clicking</li>
                <li>• When in doubt, delete the email</li>
              </ul>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default PhishingDetector;
