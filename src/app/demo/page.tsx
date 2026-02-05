'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, Clipboard, ArrowRight, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DemoUpload } from '@/components/demo/DemoUpload';
import { DemoForm } from '@/components/demo/DemoForm';
import { DemoPaste } from '@/components/demo/DemoPaste';
import { DemoPreview } from '@/components/demo/DemoPreview';
import { useTranslation } from '@/i18n';
import { IS_DEMO } from '@/lib/app-config';
import type { CVData } from '@/types';

type InputMethod = 'upload' | 'form' | 'paste';

export default function DemoPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [inputMethod, setInputMethod] = useState<InputMethod>('upload');
  const [cvData, setCvData] = useState<Partial<CVData> | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDemoHost, setIsDemoHost] = useState(false);
  const [checkedHost, setCheckedHost] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.hostname;
      setIsDemoHost(host.includes('vitae-demo') || host.includes('demo'));
      setCheckedHost(true);
    }
  }, []);

  useEffect(() => {
    if (!IS_DEMO && checkedHost && !isDemoHost) {
      router.replace('/');
    }
  }, [router, checkedHost, isDemoHost]);

  if (!checkedHost) {
    return (
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </main>
    );
  }

  if (!IS_DEMO && !isDemoHost) {
    return (
      <main className="min-h-screen pt-20 pb-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">{t('common.loading')}</p>
        </div>
      </main>
    );
  }

  const handleCvGenerated = (data: Partial<CVData>) => {
    setCvData(data);
  };

  const handleReset = () => {
    setCvData(null);
  };

  return (
    <main className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">{t('demo.badge')}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            {t('demo.titlePrefix')}{' '}
            <span className="bg-gradient-to-r from-primary to-blue-500 bg-clip-text text-transparent">
              {t('demo.titleBrand')}
            </span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            {t('demo.description')}
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {!cvData ? (
            <motion.div
              key="input"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="max-w-4xl mx-auto"
            >
              <Card>
                <CardHeader>
                  <CardTitle>{t('demo.cardTitle')}</CardTitle>
                  <CardDescription>
                    {t('demo.cardSubtitle')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Tabs value={inputMethod} onValueChange={(v) => setInputMethod(v as InputMethod)}>
                    <TabsList className="grid w-full grid-cols-3 mb-6">
                      <TabsTrigger value="upload" className="gap-2">
                        <Upload className="h-4 w-4" />
                        {t('demo.tabs.upload')}
                      </TabsTrigger>
                      <TabsTrigger value="form" className="gap-2">
                        <FileText className="h-4 w-4" />
                        {t('demo.tabs.form')}
                      </TabsTrigger>
                      <TabsTrigger value="paste" className="gap-2">
                        <Clipboard className="h-4 w-4" />
                        {t('demo.tabs.paste')}
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="upload">
                      <DemoUpload
                        onCvGenerated={handleCvGenerated}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </TabsContent>

                    <TabsContent value="form">
                      <DemoForm
                        onCvGenerated={handleCvGenerated}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </TabsContent>

                    <TabsContent value="paste">
                      <DemoPaste
                        onCvGenerated={handleCvGenerated}
                        isProcessing={isProcessing}
                        setIsProcessing={setIsProcessing}
                      />
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Info Cards */}
              <div className="grid md:grid-cols-3 gap-4 mt-8">
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <Upload className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{t('demo.infoCards.uploadTitle')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('demo.infoCards.uploadDescription')}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <FileText className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{t('demo.infoCards.formTitle')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('demo.infoCards.formDescription')}
                    </p>
                  </CardContent>
                </Card>
                <Card className="bg-muted/30">
                  <CardContent className="pt-6">
                    <Clipboard className="h-8 w-8 text-primary mb-3" />
                    <h3 className="font-semibold mb-2">{t('demo.infoCards.pasteTitle')}</h3>
                    <p className="text-sm text-muted-foreground">
                      {t('demo.infoCards.pasteDescription')}
                    </p>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
            >
              <DemoPreview cvData={cvData} onReset={handleReset} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}
