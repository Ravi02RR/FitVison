/* eslint-disable react/prop-types */
import { useState, useEffect } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import { X, Maximize2, Minimize2 } from 'lucide-react';

const Modal = ({ isOpen, onClose, children, title = "Email Preview" }) => {
    const [isFullscreen, setIsFullscreen] = useState(false);
    const [isClosing, setIsClosing] = useState(false);

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            onClose();
        }, 300);
    };

    if (!isOpen) return null;

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 
            backdrop-blur-sm bg-black/40 transition-opacity duration-300
            ${isClosing ? 'opacity-0' : 'opacity-100'}`}>

            {/* Animated backdrop circles */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-32 -left-32 w-64 h-64 bg-purple-500 rounded-full opacity-10 blur-3xl" />
                <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-500 rounded-full opacity-10 blur-3xl" />
            </div>


            <div className={`relative w-full max-w-4xl transform transition-all duration-300 
                ${isClosing ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}
                ${isFullscreen ? 'h-screen m-0' : 'max-h-[90vh]'}`}>


                <div className={`bg-slate-900/90 backdrop-blur-lg rounded-lg shadow-2xl 
                    border border-white/10 w-full h-full overflow-hidden
                    transition-transform duration-300 
                    ${isFullscreen ? 'scale-100' : 'scale-100'}`}>

                    <div className="flex justify-between items-center p-4 
                        border-b border-purple-500/30 bg-slate-800/50">
                        <h2 className="text-xl font-semibold bg-gradient-to-r from-purple-400 to-blue-400 
                            bg-clip-text text-transparent flex items-center gap-2">
                            {title}
                        </h2>

                        <div className="flex items-center gap-2">

                            <button
                                onClick={() => setIsFullscreen(!isFullscreen)}
                                className="p-2 rounded-lg hover:bg-white/10 
                                    transition-colors duration-200 text-gray-400 
                                    hover:text-white group">
                                {isFullscreen ? (
                                    <Minimize2 className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                                ) : (
                                    <Maximize2 className="w-5 h-5 transform group-hover:scale-110 transition-transform" />
                                )}
                            </button>

                            {/* Close button */}
                            <button
                                onClick={handleClose}
                                className="p-2 rounded-lg hover:bg-white/10 
                                    transition-colors duration-200 text-gray-400 
                                    hover:text-white group">
                                <X className="w-5 h-5 transform group-hover:rotate-90 transition-transform" />
                            </button>
                        </div>
                    </div>


                    <div className={`relative overflow-auto transition-all duration-300 
                        ${isFullscreen ? 'h-[calc(100vh-4rem)]' : 'max-h-[calc(90vh-4rem)]'}`}>
                        <div className="p-6 relative z-10">
                            {children}
                        </div>


                        <div className="absolute inset-0 bg-gradient-to-b from-transparent 
                            to-slate-900/50 pointer-events-none" />
                    </div>
                </div>
            </div>
        </div>
    );
};



const MonacoEditor = ({ value, onChange }) => {
    const handleEditorChange = (value) => {
        onChange({ target: { id: 'htmlContent', value } });
    };

    const editorOptions = {
        minimap: { enabled: false },
        fontSize: 14,
        wordWrap: 'on',
        automaticLayout: true,
        scrollBeyondLastLine: false,
        suggestOnTriggerCharacters: true,
        quickSuggestions: {
            other: true,
            comments: true,
            strings: true
        },
        snippets: {
            "HTML Boilerplate": {
                prefix: "!",
                body: [
                    "<div class=\"email-container\">",
                    "\t<h1>Title</h1>",
                    "\t<p>Content goes here...</p>",
                    "</div>"
                ]
            }
        }
    };

    const beforeMount = (monaco) => {
        // Register HTML completions
        monaco.languages.registerCompletionItemProvider('html', {
            provideCompletionItems: () => {
                const suggestions = [
                    {
                        label: 'div',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<div>\n\t$0\n</div>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Basic div element'
                    },
                    {
                        label: 'table',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td>\n\t\t\t$0\n\t\t</td>\n\t</tr>\n</table>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe table structure'
                    },
                    {
                        label: 'button',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td style="border-radius: 4px; background-color: #007bff;">\n\t\t\t<a href="$1" style="padding: 12px 24px; color: #ffffff; text-decoration: none; display: inline-block;">$0</a>\n\t\t</td>\n\t</tr>\n</table>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe button'
                    },
                    {
                        label: 'image',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<img src="$1" alt="$2" width="$3" style="display: block; max-width: 100%;" border="0"/>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe image'
                    },
                    {
                        label: 'spacer',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" border="0" cellpadding="0" cellspacing="0">\n\t<tr>\n\t\t<td height="$1">&nbsp;</td>\n\t</tr>\n</table>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe vertical spacer'
                    },
                    {
                        label: 'two-column',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td width="50%" valign="top">\n\t\t\t$1\n\t\t</td>\n\t\t<td width="50%" valign="top">\n\t\t\t$2\n\t\t</td>\n\t</tr>\n</table>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Two-column layout'
                    },
                    {
                        label: 'header',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<h1 style="margin: 0; font-size: 24px; line-height: 1.4; color: #333333; font-family: Arial, sans-serif;">$0</h1>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe header'
                    },
                    {
                        label: 'paragraph',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<p style="margin: 0 0 15px 0; font-size: 16px; line-height: 1.6; color: #666666; font-family: Arial, sans-serif;">$0</p>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe paragraph'
                    },
                    {
                        label: 'container',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td style="padding: 20px;">\n\t\t\t$0\n\t\t</td>\n\t</tr>\n</table>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Padded container'
                    },
                    {
                        label: 'divider',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td style="padding: 20px 0;">\n\t\t\t<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t\t\t\t<tr>\n\t\t\t\t\t<td style="border-top: 1px solid #dddddd;">&nbsp;</td>\n\t\t\t\t</tr>\n\t\t\t</table>\n\t\t</td>\n\t</tr>\n</table>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Horizontal divider'
                    },
                    {
                        label: 'list',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td style="padding: 0 0 0 20px;">\n\t\t\t• $1\n\t\t</td>\n\t</tr>\n\t<tr>\n\t\t<td style="padding: 5px 0 0 20px;">\n\t\t\t• $2\n\t\t</td>\n\t</tr>\n</table>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Email-safe bulleted list'
                    },
                    {
                        label: 'social-links',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<table cellpadding="0" cellspacing="0" border="0">\n\t<tr>\n\t\t<td style="padding-right: 10px;">\n\t\t\t<a href="$1"><img src="facebook-icon.png" alt="Facebook" width="32" style="display: block;" border="0"/></a>\n\t\t</td>\n\t\t<td style="padding-right: 10px;">\n\t\t\t<a href="$2"><img src="twitter-icon.png" alt="Twitter" width="32" style="display: block;" border="0"/></a>\n\t\t</td>\n\t\t<td>\n\t\t\t<a href="$3"><img src="linkedin-icon.png" alt="LinkedIn" width="32" style="display: block;" border="0"/></a>\n\t\t</td>\n\t</tr>\n</table>$0',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Social media links'
                    },
                    {
                        label: 'responsive-container',
                        kind: monaco.languages.CompletionItemKind.Snippet,
                        insertText: '<!DOCTYPE html>\n<html>\n<head>\n\t<meta charset="utf-8">\n\t<meta name="viewport" content="width=device-width, initial-scale=1.0">\n\t<title>$1</title>\n</head>\n<body style="margin: 0; padding: 0; background-color: #f4f4f4;">\n\t<table width="100%" cellpadding="0" cellspacing="0" border="0">\n\t\t<tr>\n\t\t\t<td>\n\t\t\t\t<table class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="margin: 0 auto; background-color: #ffffff;">\n\t\t\t\t\t<tr>\n\t\t\t\t\t\t<td style="padding: 20px;">\n\t\t\t\t\t\t\t$0\n\t\t\t\t\t\t</td>\n\t\t\t\t\t</tr>\n\t\t\t\t</table>\n\t\t\t</td>\n\t\t</tr>\n\t</table>\n</body>\n</html>',
                        insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
                        documentation: 'Responsive email container template'
                    }
                ];
                return { suggestions };
            }
        });
    };

    return (
        <div className="border border-purple-500/30 rounded-lg overflow-hidden">
            <Editor
                height="400px"
                defaultLanguage="html"
                value={value}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={editorOptions}
                beforeMount={beforeMount}
                className="w-full"
            />
        </div>
    );
};

const SendMassMail = () => {
    const [formData, setFormData] = useState({
        subject: '',
        htmlContent: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);

    useEffect(() => {
        const savedData = localStorage.getItem('emailDraft');
        if (savedData) {
            setFormData(JSON.parse(savedData));
        }
    }, []);

    const saveToLocalStorage = (data) => {
        localStorage.setItem('emailDraft', JSON.stringify(data));
    };

    const handleChange = (e) => {
        const newData = {
            ...formData,
            [e.target.id]: e.target.value
        };
        setFormData(newData);
        saveToLocalStorage(newData);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage('');

        try {
            const response = await axios.post('/api/v1/subs/email', formData, {
                headers: {
                    'admintoken': localStorage.getItem('adminToken')
                }
            });

            setMessage('✨ Mass email campaign launched successfully!');
            localStorage.removeItem('emailDraft');
            setFormData({ subject: '', htmlContent: '' });
        } catch (error) {
            setMessage(error.response?.data?.message || 'An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-r from-gray-900 to-blue-900 text-white p-8">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
                    Mass Email Campaign
                </h1>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-4">
                        <label htmlFor="subject" className="block text-lg font-semibold text-purple-200">
                            Subject Line
                        </label>
                        <input
                            type="text"
                            id="subject"
                            value={formData.subject}
                            onChange={handleChange}
                            className="w-full px-4 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg 
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent
                            text-white placeholder-gray-400 transition duration-200"
                            placeholder="Enter engaging subject line..."
                            required
                        />
                    </div>

                    <div className="space-y-4">
                        <label htmlFor="htmlContent" className="block text-lg font-semibold text-purple-200">
                            Email Content (HTML)
                        </label>
                        <MonacoEditor value={formData.htmlContent} onChange={handleChange} />
                    </div>

                    <div className="flex items-center justify-between pt-6">
                        <button
                            type="button"
                            onClick={() => setIsPreviewOpen(true)}
                            className="px-6 py-3 bg-slate-800/50 border border-purple-500/30 rounded-lg
                            font-semibold text-purple-200 hover:bg-purple-500/20 transition duration-200"
                        >
                            Preview Email
                        </button>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className={`px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg
                            font-semibold text-white shadow-lg hover:from-purple-700 hover:to-blue-700
                            focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2
                            focus:ring-offset-slate-900 transition duration-200
                            ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                        >
                            {isLoading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Processing...
                                </span>
                            ) : (
                                'Send Mail'
                            )}
                        </button>
                    </div>
                </form>

                {message && (
                    <div className={`mt-6 p-4 rounded-lg ${message.includes('successfully')
                        ? 'bg-green-500/10 text-green-400 border border-green-500/30'
                        : 'bg-red-500/10 text-red-400 border border-red-500/30'
                        }`}>
                        {message}
                    </div>
                )}

                <Modal isOpen={isPreviewOpen} onClose={() => setIsPreviewOpen(false)}>
                    <div className="bg-white rounded-lg p-6">
                        <h3 className="text-gray-800 font-semibold mb-4">Subject: {formData.subject}</h3>
                        <div className="prose max-w-none">
                            <div
                                dangerouslySetInnerHTML={{ __html: formData.htmlContent }}
                                className="text-gray-800"
                            />
                        </div>
                    </div>
                </Modal>
            </div>
        </div>
    );
};

export default SendMassMail;