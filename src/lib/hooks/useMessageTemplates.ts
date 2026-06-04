'use client';

import { Lead, PriorityLevel } from '@/lib/types';
import { createActivityLog, createNotification } from '@/lib/services/aiLeadAgentService';

export interface GeneratedMessages {
  email: string;
  whatsapp: string;
  linkedin: string;
}

export function useMessageTemplates() {
  const getGreeting = (firstName: string): string => {
    return `Dear ${firstName},`;
  };

  const getServiceTemplate = (service: string, priority: PriorityLevel): { opening: string; explanation: string } => {
    const templates: Record<string, Record<PriorityLevel, { opening: string; explanation: string }>> = {
      'Second Passport': {
        High: {
          opening: 'We specialize in second passport solutions for high-net-worth individuals seeking enhanced mobility and security.',
          explanation: 'Our team provides expert guidance on securing a second passport through legitimate pathways, ensuring compliance with all regulatory requirements.'
        },
        Medium: {
          opening: 'We assist clients in exploring second passport opportunities to expand their global mobility options.',
          explanation: 'Our advisors guide you through the legitimate channels available for obtaining a second passport based on your circumstances.'
        },
        Low: {
          opening: 'We can help you understand second passport options available to you.',
          explanation: 'Learn more about how second passports work and whether this option might be suitable for your needs.'
        }
      },
      'EU Residency': {
        High: {
          opening: 'We specialize in EU residency solutions for individuals and families seeking European living opportunities.',
          explanation: 'Our team navigates the various EU residency pathways, helping you find the most suitable option based on your goals and circumstances.'
        },
        Medium: {
          opening: 'We help clients explore EU residency options that align with their lifestyle and investment capabilities.',
          explanation: 'From D visas to residency permits, we guide you through available pathways with full regulatory compliance.'
        },
        Low: {
          opening: 'We can help you learn about EU residency possibilities.',
          explanation: 'Discover the different ways to establish residency in the European Union.'
        }
      },
      'US Green Card': {
        High: {
          opening: 'We assist high-net-worth individuals in securing US green cards through strategic immigration planning.',
          explanation: 'Our expertise covers employment-based, investment-based, and family-based pathways to permanent US residency.'
        },
        Medium: {
          opening: 'We guide clients through US green card options tailored to their professional and family situation.',
          explanation: 'Whether through employment, investment, or family sponsorship, we help navigate the US immigration process.'
        },
        Low: {
          opening: 'We can provide information about US green card pathways.',
          explanation: 'Learn about the various ways to pursue permanent residency in the United States.'
        }
      },
      'Banking': {
        High: {
          opening: 'We specialize in international banking solutions for clients with significant assets requiring specialized services.',
          explanation: 'Our network of banking partners offers tailored solutions for wealth management, currency management, and compliance.'
        },
        Medium: {
          opening: 'We help you find banking solutions that meet your international financial needs.',
          explanation: 'From account opening to specialized banking services, we facilitate connections with suitable institutions.'
        },
        Low: {
          opening: 'We can assist with banking information and connections.',
          explanation: 'Learn about banking options available for international clients.'
        }
      },
      'Company Registration': {
        High: {
          opening: 'We provide comprehensive company registration services in key jurisdictions for sophisticated business owners.',
          explanation: 'Our team handles entity formation, regulatory compliance, and ongoing administration across multiple jurisdictions.'
        },
        Medium: {
          opening: 'We assist with company registration and setup in strategic jurisdictions.',
          explanation: 'From entity selection to registration, we guide you through the process with full regulatory compliance.'
        },
        Low: {
          opening: 'We can help with company registration information.',
          explanation: 'Learn about company formation options in various jurisdictions.'
        }
      },
      'Property Purchase': {
        High: {
          opening: 'We provide end-to-end property acquisition services for discerning clients seeking premium real estate.',
          explanation: 'Our team handles due diligence, legal documentation, and transaction management across premium property markets.'
        },
        Medium: {
          opening: 'We assist with property purchases and real estate investments in key markets.',
          explanation: 'From property search to transaction completion, we ensure full compliance with local regulations.'
        },
        Low: {
          opening: 'We can help with property purchase information.',
          explanation: 'Learn about real estate investment opportunities in various markets.'
        }
      },
      'International Contracts': {
        High: {
          opening: 'We provide specialized international contract services for complex multi-jurisdictional agreements.',
          explanation: 'Our legal team drafts, reviews, and negotiates international contracts ensuring enforceability across jurisdictions.'
        },
        Medium: {
          opening: 'We assist with international contracts and cross-border agreements.',
          explanation: 'Our team ensures your contracts comply with requirements across all relevant jurisdictions.'
        },
        Low: {
          opening: 'We can help with international contract guidance.',
          explanation: 'Learn about international contract requirements and best practices.'
        }
      },
      'Dispute Resolution': {
        High: {
          opening: 'We provide sophisticated dispute resolution services for complex international matters.',
          explanation: 'Our team navigates arbitration, mediation, and litigation across multiple jurisdictions with expert counsel.'
        },
        Medium: {
          opening: 'We assist with dispute resolution and conflict management.',
          explanation: 'Whether through negotiation, mediation, or arbitration, we work to reach favorable resolutions.'
        },
        Low: {
          opening: 'We can provide dispute resolution information.',
          explanation: 'Learn about options for resolving international disputes.'
        }
      }
    };

    return templates[service] ? templates[service][priority] : {
      opening: 'We provide professional advisory services tailored to your needs.',
      explanation: 'Our team is ready to discuss how we can assist you.'
    };
  };

  const generateMessages = (lead: Lead): GeneratedMessages => {
    const firstName = lead.fullName.split(' ')[0];
    const greeting = getGreeting(firstName);
    const { opening, explanation } = getServiceTemplate(lead.serviceInterest, lead.priorityLevel);

    // Email version (more detailed)
    const email = `${greeting}

${opening}

${explanation}

We would welcome the opportunity to discuss your specific situation in a confidential consultation. Our team can provide personalized guidance based on your unique circumstances and objectives.

If you would like to explore this further, please let us know your preferred time for a discussion.

Best regards,
PLUCO GROUP
Confidential Advisory Services`;

    // WhatsApp version (shorter, more casual)
    const whatsapp = `Hi ${firstName} 👋

${opening.slice(0, 100)}...

We'd love to discuss your needs in a confidential consultation. Perfect time to connect? 📅

PLUCO GROUP`;

    // LinkedIn version (professional, engaging)
    const linkedin = `Hi ${firstName},

${opening}

${explanation.slice(0, 150)}...

I'd be happy to schedule a brief confidential call to explore how we might assist. No obligation—just a conversation.

Looking forward to connecting!

PLUCO GROUP`;

    return { email, whatsapp, linkedin };
  };

  const generateAndSaveMessages = async (lead: Lead): Promise<GeneratedMessages | null> => {
    try {
      const messages = generateMessages(lead);

      // Create activity log
      await createActivityLog(
        'message_prepared',
        'Messages Generated',
        `Generated email, WhatsApp, and LinkedIn message templates for ${lead.fullName}`,
        lead.id,
        lead.priorityLevel
      );

      // Create notification
      await createNotification(
        'message',
        `📧 Messages Generated: ${lead.fullName}`,
        `Email, WhatsApp, and LinkedIn message templates are ready to send`,
        'success',
        lead.id
      );

      return messages;
    } catch (error) {
      console.error('Error generating messages:', error);
      return null;
    }
  };

  return {
    generateMessages,
    generateAndSaveMessages,
  };
}
