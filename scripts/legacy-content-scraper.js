#!/usr/bin/env node

/**
 * Legacy Website Content Scraper for Dr. Pedro's Practice
 * Extracts content from 5 legacy websites to populate Supabase backend
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

// Target websites to scrape
const WEBSITES = [
    {
        url: 'https://statenislandtmj.com',
        name: 'Staten Island TMJ',
        category: 'TMJ',
        specialty: 'TMJ Treatment'
    },
    {
        url: 'https://statenislandimplantdr.com',
        name: 'Staten Island Implant Dr',
        category: 'Implants',
        specialty: 'Dental Implants'
    },
    {
        url: 'https://roboticimplantsnyc.com',
        name: 'Robotic Implants NYC',
        category: 'Robotic Surgery',
        specialty: 'Yomi Robotic Implants'
    },
    {
        url: 'https://dentalmedispa.com',
        name: 'Dental MedSpa',
        category: 'MedSpa',
        specialty: 'Cosmetic Dental MedSpa'
    },
    {
        url: 'https://aboutfacedentalmedspa.com',
        name: 'About Face Dental MedSpa',
        category: 'MedSpa',
        specialty: 'EMFACE & Cosmetic Treatments'
    }
];

// Data structure for extracted content
const extractedData = {
    services: [],
    testimonials: [],
    staff: [],
    practiceInfo: {},
    beforeAfterImages: [],
    procedures: [],
    contactInfo: {}
};

class ContentScraper {
    constructor() {
        this.browser = null;
        this.page = null;
    }

    async initialize() {
        console.log('🚀 Initializing browser...');
        this.browser = await puppeteer.launch({
            headless: false,
            defaultViewport: { width: 1280, height: 720 },
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });
        this.page = await this.browser.newPage();
        
        // Set longer timeouts for page loads
        this.page.setDefaultTimeout(30000);
        this.page.setDefaultNavigationTimeout(30000);
    }

    async scrapeWebsite(website) {
        console.log(`\n📱 Scraping ${website.name} (${website.url})`);
        
        try {
            await this.page.goto(website.url, { waitUntil: 'networkidle2' });
            await new Promise(resolve => setTimeout(resolve, 2000));

            const siteData = {
                url: website.url,
                name: website.name,
                category: website.category,
                specialty: website.specialty,
                services: [],
                testimonials: [],
                staff: [],
                procedures: [],
                images: [],
                contact: {}
            };

            // Extract main content
            await this.extractServices(siteData);
            await this.extractTestimonials(siteData);
            await this.extractStaff(siteData);
            await this.extractContactInfo(siteData);
            await this.extractImages(siteData);
            await this.extractProcedures(siteData);

            // Scroll through the page to capture dynamic content
            await this.scrollAndCapture(siteData);

            return siteData;

        } catch (error) {
            console.error(`❌ Error scraping ${website.name}:`, error.message);
            return {
                url: website.url,
                name: website.name,
                category: website.category,
                error: error.message
            };
        }
    }

    async extractServices(siteData) {
        console.log('  🔍 Extracting services...');
        
        const services = await this.page.evaluate(() => {
            const serviceElements = [];
            
            // Look for common service-related selectors
            const selectors = [
                '.service', '.services', '.treatment', '.treatments',
                '.procedure', '.procedures', '[class*="service"]',
                '[class*="treatment"]', '[id*="service"]',
                'h2, h3, h4', '.card', '.box'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent.trim();
                    const title = el.querySelector('h1, h2, h3, h4, .title')?.textContent?.trim();
                    
                    // Look for service-related keywords
                    const serviceKeywords = [
                        'implant', 'tmj', 'robotic', 'yomi', 'emface',
                        'cosmetic', 'whitening', 'cleaning', 'extraction',
                        'crown', 'bridge', 'denture', 'veneer', 'surgery',
                        'orthodontic', 'braces', 'invisalign'
                    ];

                    if (serviceKeywords.some(keyword => 
                        text.toLowerCase().includes(keyword) || 
                        title?.toLowerCase().includes(keyword)
                    )) {
                        serviceElements.push({
                            title: title || text.substring(0, 100),
                            description: text,
                            element: el.outerHTML.substring(0, 500)
                        });
                    }
                });
            });

            return serviceElements;
        });

        siteData.services = services;
        console.log(`    ✅ Found ${services.length} services`);
    }

    async extractTestimonials(siteData) {
        console.log('  🗣️ Extracting testimonials...');
        
        const testimonials = await this.page.evaluate(() => {
            const testimonialElements = [];
            
            const selectors = [
                '.testimonial', '.review', '.feedback', '.patient-story',
                '[class*="testimonial"]', '[class*="review"]',
                '.quote', '.customer-review'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const text = el.textContent.trim();
                    const author = el.querySelector('.author, .name, .patient')?.textContent?.trim();
                    
                    if (text.length > 50) {
                        testimonialElements.push({
                            text: text,
                            author: author || 'Anonymous',
                            rating: 5, // Default rating
                            element: el.outerHTML.substring(0, 500)
                        });
                    }
                });
            });

            return testimonialElements;
        });

        siteData.testimonials = testimonials;
        console.log(`    ✅ Found ${testimonials.length} testimonials`);
    }

    async extractStaff(siteData) {
        console.log('  👥 Extracting staff information...');
        
        const staff = await this.page.evaluate(() => {
            const staffElements = [];
            
            const selectors = [
                '.doctor', '.staff', '.team', '.provider',
                '[class*="doctor"]', '[class*="staff"]', '[class*="team"]'
            ];

            selectors.forEach(selector => {
                const elements = document.querySelectorAll(selector);
                elements.forEach(el => {
                    const name = el.querySelector('.name, h1, h2, h3, h4')?.textContent?.trim();
                    const title = el.querySelector('.title, .degree, .specialty')?.textContent?.trim();
                    const bio = el.querySelector('.bio, .description, p')?.textContent?.trim();
                    const image = el.querySelector('img')?.src;
                    
                    if (name && name.toLowerCase().includes('dr') || title) {
                        staffElements.push({
                            name: name,
                            title: title,
                            bio: bio,
                            image: image
                        });
                    }
                });
            });

            return staffElements;
        });

        siteData.staff = staff;
        console.log(`    ✅ Found ${staff.length} staff members`);
    }

    async extractContactInfo(siteData) {
        console.log('  📞 Extracting contact information...');
        
        const contact = await this.page.evaluate(() => {
            const contactInfo = {};
            
            console.log('DEBUG: Starting enhanced contact extraction...');
            
            // Extract phone numbers with validation
            const phoneRegex = /(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})/g;
            const allPhones = document.body.textContent.match(phoneRegex) || [];
            console.log('DEBUG: Raw phone matches:', allPhones);
            
            const validPhones = allPhones.filter(phone => {
                const cleaned = phone.replace(/[^\d]/g, '');
                const isValid = cleaned.length === 10 &&
                               !cleaned.match(/^0+$/) &&
                               cleaned !== '1234567890' &&
                               !cleaned.startsWith('000') &&
                               !cleaned.startsWith('111');
                console.log(`DEBUG: Phone validation: ${phone} -> ${cleaned} -> valid: ${isValid}`);
                return isValid;
            });
            contactInfo.phones = [...new Set(validPhones)];
            
            // Extract email addresses with validation
            const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})/g;
            const allEmails = document.body.textContent.match(emailRegex) || [];
            console.log('DEBUG: Raw email matches:', allEmails);
            
            const validEmails = allEmails.filter(email => {
                const isValid = email &&
                               email.includes('.') &&
                               !email.toLowerCase().includes('filler') &&
                               !email.toLowerCase().includes('example') &&
                               !email.toLowerCase().includes('test') &&
                               email.length < 50 &&
                               email.split('@')[0].length > 2;
                console.log(`DEBUG: Email validation: ${email} -> valid: ${isValid}`);
                return isValid;
            });
            contactInfo.emails = [...new Set(validEmails)];
            
            // Extract addresses with strict validation
            const addressElements = document.querySelectorAll('.address, [class*="address"], [class*="location"], address');
            console.log('DEBUG: Address elements found:', addressElements.length);
            
            const validAddresses = Array.from(addressElements)
                .map(el => el.textContent.trim())
                .filter(text => {
                    const isValid = text &&
                                   text.length > 10 &&
                                   text.length < 200 &&
                                   (text.includes('Staten Island') || text.includes('NY') || text.includes('New York')) &&
                                   !text.includes('css') &&
                                   !text.includes('function') &&
                                   !text.includes('javascript') &&
                                   !text.includes('<?') &&
                                   !/^\s*$/.test(text);
                    console.log(`DEBUG: Address validation: "${text.substring(0, 50)}..." -> valid: ${isValid}`);
                    return isValid;
                });
            contactInfo.addresses = [...new Set(validAddresses)];
            
            // Extract business hours with validation
            const hoursElements = document.querySelectorAll('.hours, [class*="hours"], [class*="schedule"], [class*="time"]');
            const validHours = Array.from(hoursElements)
                .map(el => el.textContent.trim())
                .filter(text => {
                    const isValid = text &&
                                   text.length > 5 &&
                                   text.length < 100 &&
                                   (text.includes('Mon') || text.includes('Tue') || text.includes('Wed') ||
                                    text.includes('Thu') || text.includes('Fri') || text.includes('Sat') ||
                                    text.includes('Sun') || text.includes(':') || text.includes('am') ||
                                    text.includes('pm') || text.includes('AM') || text.includes('PM'));
                    return isValid;
                });
            contactInfo.hours = [...new Set(validHours)];
            
            console.log('DEBUG: Final contact extraction results:', {
                phones: contactInfo.phones.length,
                emails: contactInfo.emails.length,
                addresses: contactInfo.addresses.length,
                hours: contactInfo.hours.length
            });
            
            return contactInfo;
        });

        siteData.contact = contact;
        console.log(`    ✅ Found contact info: ${contact.phones?.length || 0} phones, ${contact.emails?.length || 0} emails, ${contact.addresses?.length || 0} addresses`);
    }

    async extractImages(siteData) {
        console.log('  🖼️ Extracting images...');
        
        const images = await this.page.evaluate(() => {
            const imageData = [];
            
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                const src = img.src;
                const alt = img.alt;
                
                // Look for before/after, treatment, or procedure images
                const relevantKeywords = [
                    'before', 'after', 'treatment', 'procedure', 'result',
                    'patient', 'smile', 'teeth', 'implant', 'surgery'
                ];
                
                if (relevantKeywords.some(keyword => 
                    alt?.toLowerCase().includes(keyword) || 
                    src?.toLowerCase().includes(keyword)
                )) {
                    imageData.push({
                        src: src,
                        alt: alt,
                        type: alt?.toLowerCase().includes('before') ? 'before' :
                              alt?.toLowerCase().includes('after') ? 'after' :
                              'treatment'
                    });
                }
            });
            
            return imageData;
        });

        siteData.images = images;
        console.log(`    ✅ Found ${images.length} relevant images`);
    }

    async extractProcedures(siteData) {
        console.log('  🔬 Extracting procedures...');
        
        const procedures = await this.page.evaluate(() => {
            const procedureData = [];
            
            // Look for detailed procedure descriptions
            const procedureKeywords = [
                'procedure', 'treatment', 'surgery', 'therapy',
                'process', 'method', 'technique'
            ];
            
            const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
            headings.forEach(heading => {
                const text = heading.textContent.trim();
                
                if (procedureKeywords.some(keyword => text.toLowerCase().includes(keyword))) {
                    const nextElement = heading.nextElementSibling;
                    const description = nextElement?.textContent?.trim() || '';
                    
                    procedureData.push({
                        name: text,
                        description: description.substring(0, 500),
                        category: text.toLowerCase().includes('implant') ? 'Implants' :
                                text.toLowerCase().includes('tmj') ? 'TMJ' :
                                text.toLowerCase().includes('cosmetic') ? 'Cosmetic' :
                                'General'
                    });
                }
            });
            
            return procedureData;
        });

        siteData.procedures = procedures;
        console.log(`    ✅ Found ${procedures.length} procedures`);
    }

    async scrollAndCapture(siteData) {
        console.log('  📜 Scrolling to capture dynamic content...');
        
        try {
            // Scroll through the page to load any lazy-loaded content
            const scrolls = 3;
            for (let i = 0; i < scrolls; i++) {
                await this.page.evaluate(() => {
                    window.scrollBy(0, window.innerHeight);
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            
            // Capture any additional content that loaded
            const additionalContent = await this.page.evaluate(() => {
                return {
                    pageTitle: document.title,
                    metaDescription: document.querySelector('meta[name="description"]')?.content,
                    allText: document.body.textContent.trim()
                };
            });
            
            siteData.additionalContent = additionalContent;
            
        } catch (error) {
            console.error('    ⚠️ Error during scrolling:', error.message);
        }
    }

    async processAllWebsites() {
        const results = [];
        
        for (const website of WEBSITES) {
            const siteData = await this.scrapeWebsite(website);
            results.push(siteData);
            
            // Wait between sites to be respectful
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
        
        return results;
    }

    async consolidateData(scrapedData) {
        console.log('\n🔄 Consolidating extracted data...');
        
        const consolidated = {
            services: [],
            testimonials: [],
            staff: [],
            practiceInfo: {
                websites: scrapedData.map(site => ({
                    name: site.name,
                    url: site.url,
                    category: site.category,
                    specialty: site.specialty
                }))
            },
            beforeAfterImages: [],
            procedures: [],
            contactInfo: {}
        };

        // Consolidate services
        scrapedData.forEach(site => {
            if (site.services) {
                site.services.forEach(service => {
                    consolidated.services.push({
                        name: service.title,
                        description: service.description,
                        category: site.category,
                        source_site: site.name,
                        estimated_duration: '1 hour', // Default
                        price_range: { min: 0, max: 0 }, // To be filled
                        is_yomi_technology: site.category === 'Robotic Surgery'
                    });
                });
            }
        });

        // Consolidate testimonials
        scrapedData.forEach(site => {
            if (site.testimonials) {
                site.testimonials.forEach(testimonial => {
                    consolidated.testimonials.push({
                        comment: testimonial.text,
                        rating: testimonial.rating || 5,
                        source_site: site.name,
                        patient_name: testimonial.author,
                        is_approved: true
                    });
                });
            }
        });

        // Consolidate staff
        scrapedData.forEach(site => {
            if (site.staff) {
                site.staff.forEach(staff => {
                    consolidated.staff.push({
                        first_name: staff.name?.split(' ')[0] || '',
                        last_name: staff.name?.split(' ').slice(1).join(' ') || '',
                        title: staff.title || 'Doctor',
                        specialization: site.specialty,
                        bio: staff.bio,
                        image_url: staff.image,
                        source_site: site.name
                    });
                });
            }
        });

        // Consolidate images
        scrapedData.forEach(site => {
            if (site.images) {
                site.images.forEach(image => {
                    consolidated.beforeAfterImages.push({
                        url: image.src,
                        alt_text: image.alt,
                        type: image.type,
                        source_site: site.name
                    });
                });
            }
        });

        // Consolidate procedures
        scrapedData.forEach(site => {
            if (site.procedures) {
                site.procedures.forEach(procedure => {
                    consolidated.procedures.push({
                        name: procedure.name,
                        description: procedure.description,
                        category: procedure.category,
                        source_site: site.name
                    });
                });
            }
        });

        // Consolidate contact info with enhanced logging
        const allContacts = scrapedData.map(site => site.contact).filter(Boolean);
        console.log('DEBUG: Contact consolidation - sites with contact data:', allContacts.length);
        
        allContacts.forEach((contact, index) => {
            console.log(`DEBUG: Site ${index} contact data:`, {
                phones: contact.phones?.length || 0,
                emails: contact.emails?.length || 0,
                addresses: contact.addresses?.length || 0,
                hours: contact.hours?.length || 0
            });
            
            // Log sample data to identify issues
            if (contact.phones?.length > 0) {
                console.log(`DEBUG: Site ${index} phone samples:`, contact.phones.slice(0, 3));
            }
            if (contact.emails?.length > 0) {
                console.log(`DEBUG: Site ${index} email samples:`, contact.emails.slice(0, 3));
            }
            if (contact.addresses?.length > 0) {
                console.log(`DEBUG: Site ${index} address samples:`, contact.addresses.slice(0, 1).map(a => a.substring(0, 100) + '...'));
            }
        });
        
        consolidated.contactInfo = {
            phones: [...new Set(allContacts.flatMap(c => c.phones || []))],
            emails: [...new Set(allContacts.flatMap(c => c.emails || []))],
            addresses: [...new Set(allContacts.flatMap(c => c.addresses || []))],
            hours: [...new Set(allContacts.flatMap(c => c.hours || []))]
        };
        
        console.log('DEBUG: Final consolidated contact stats:', {
            phones: consolidated.contactInfo.phones.length,
            emails: consolidated.contactInfo.emails.length,
            addresses: consolidated.contactInfo.addresses.length,
            hours: consolidated.contactInfo.hours.length
        });

        return consolidated;
    }

    async saveResults(consolidatedData, rawData) {
        console.log('\n💾 Saving results...');
        
        const outputDir = path.join(__dirname, '..', 'extracted-content');
        
        try {
            await fs.mkdir(outputDir, { recursive: true });
            
            // Save consolidated data (ready for database insertion)
            await fs.writeFile(
                path.join(outputDir, 'consolidated-content.json'),
                JSON.stringify(consolidatedData, null, 2)
            );
            
            // Save raw scraped data (for reference)
            await fs.writeFile(
                path.join(outputDir, 'raw-scraped-data.json'),
                JSON.stringify(rawData, null, 2)
            );
            
            // Create database insertion scripts
            await this.generateInsertionScripts(consolidatedData, outputDir);
            
            console.log('✅ Results saved to:', outputDir);
            
        } catch (error) {
            console.error('❌ Error saving results:', error);
        }
    }

    async generateInsertionScripts(data, outputDir) {
        console.log('  📝 Generating database insertion scripts...');
        
        // Generate SQL for services
        const servicesSql = data.services.map(service => {
            const name = service.name.replace(/'/g, "''");
            const description = service.description.replace(/'/g, "''");
            const category = service.category.replace(/'/g, "''");
            
            return `INSERT INTO services (name, description, category, estimated_duration, price_range, is_yomi_technology) VALUES 
('${name}', '${description}', '${category}', '1 hour', '{"min": 0, "max": 0}', ${service.is_yomi_technology});`;
        }).join('\n\n');

        // Generate SQL for staff
        const staffSql = data.staff.map(staff => {
            const firstName = staff.first_name.replace(/'/g, "''");
            const lastName = staff.last_name.replace(/'/g, "''");
            const title = staff.title.replace(/'/g, "''");
            const specialization = staff.specialization.replace(/'/g, "''");
            const bio = (staff.bio || '').replace(/'/g, "''");
            
            return `INSERT INTO staff (first_name, last_name, title, specialization, bio, image_url) VALUES 
('${firstName}', '${lastName}', '${title}', '${specialization}', '${bio}', '${staff.image_url || ''}');`;
        }).join('\n\n');

        // Save SQL files
        await fs.writeFile(path.join(outputDir, 'services-insert.sql'), servicesSql);
        await fs.writeFile(path.join(outputDir, 'staff-insert.sql'), staffSql);
        
        console.log('    ✅ SQL insertion scripts generated');
    }

    async cleanup() {
        if (this.browser) {
            await this.browser.close();
            console.log('🧹 Browser closed');
        }
    }
}

// Main execution function
async function main() {
    console.log('🎯 Starting Legacy Website Content Scraper');
    console.log('🎯 Target: 5 Dr. Pedro legacy websites');
    console.log('🎯 Goal: Extract content for Supabase population\n');

    const scraper = new ContentScraper();

    try {
        await scraper.initialize();
        const scrapedData = await scraper.processAllWebsites();
        const consolidatedData = await scraper.consolidateData(scrapedData);
        await scraper.saveResults(consolidatedData, scrapedData);
        
        // Generate summary report
        console.log('\n📊 EXTRACTION SUMMARY:');
        console.log(`✅ Services extracted: ${consolidatedData.services.length}`);
        console.log(`✅ Testimonials extracted: ${consolidatedData.testimonials.length}`);
        console.log(`✅ Staff members extracted: ${consolidatedData.staff.length}`);
        console.log(`✅ Images extracted: ${consolidatedData.beforeAfterImages.length}`);
        console.log(`✅ Procedures extracted: ${consolidatedData.procedures.length}`);
        console.log(`✅ Contact info: ${consolidatedData.contactInfo.phones.length} phones, ${consolidatedData.contactInfo.emails.length} emails`);
        
        console.log('\n🎉 Content extraction completed successfully!');
        console.log('📁 Check ./extracted-content/ for results');
        
    } catch (error) {
        console.error('❌ Fatal error:', error);
    } finally {
        await scraper.cleanup();
    }
}

// Run the scraper
if (require.main === module) {
    main().catch(console.error);
}

module.exports = { ContentScraper, WEBSITES };