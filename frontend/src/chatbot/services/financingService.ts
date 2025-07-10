import axios from 'axios';

export interface PatientFinancingData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: string;
  ssn?: string; // Last 4 digits only
  income?: number;
  procedureAmount: number;
  procedureType: 'yomi' | 'tmj' | 'emface';
}

export interface InsuranceVerificationData {
  patientFirstName: string;
  patientLastName: string;
  patientDOB: string;
  insuranceProvider: string;
  memberId: string;
  groupNumber?: string;
  procedureCode?: string;
}

export interface FinancingResult {
  approved: boolean;
  provider: 'sunbit' | 'cherry' | 'carecredit';
  approvalAmount?: number;
  monthlyPayment?: number;
  term?: number;
  apr?: number;
  preQualificationId?: string;
  expirationDate?: string;
  message: string;
  applicationUrl?: string;
  features?: string[];
}

export interface InsuranceResult {
  eligible: boolean;
  provider: string;
  coveragePercentage?: number;
  deductible?: number;
  deductibleMet?: number;
  maxAnnualBenefit?: number;
  usedBenefit?: number;
  remainingBenefit?: number;
  copay?: number;
  limitations?: string[];
  waitingPeriod?: boolean;
  message: string;
}

class FinancingService {
  // API keys would be used in production
  // private sunbitApiKey: string;
  // private cherryApiKey: string;
  // private zuubApiKey: string;
  // private pverifyApiKey: string;

  constructor() {
    // In production, these would come from environment variables
    // this.sunbitApiKey = import.meta.env.VITE_SUNBIT_API_KEY || '';
    // this.cherryApiKey = import.meta.env.VITE_CHERRY_API_KEY || '';
    // this.zuubApiKey = import.meta.env.VITE_ZUUB_API_KEY || '';
    // this.pverifyApiKey = import.meta.env.VITE_PVERIFY_API_KEY || '';
  }

  // Patient Financing Methods

  async checkFinancingEligibility(data: PatientFinancingData): Promise<FinancingResult[]> {
    const results: FinancingResult[] = [];

    // Try Sunbit first (highest approval rate)
    try {
      const sunbitResult = await this.checkSunbit(data);
      if (sunbitResult) results.push(sunbitResult);
    } catch (error) {
      console.error('Sunbit check failed:', error);
    }

    // Try Cherry if Sunbit doesn't approve full amount
    if (!results.length || results[0].approvalAmount! < data.procedureAmount) {
      try {
        const cherryResult = await this.checkCherry(data);
        if (cherryResult) results.push(cherryResult);
      } catch (error) {
        console.error('Cherry check failed:', error);
      }
    }

    // Try CareCredit for higher credit scores
    if (data.income && data.income > 50000) {
      try {
        const careCreditResult = await this.checkCareCredit(data);
        if (careCreditResult) results.push(careCreditResult);
      } catch (error) {
        console.error('CareCredit check failed:', error);
      }
    }

    return results;
  }

  private async checkSunbit(data: PatientFinancingData): Promise<FinancingResult> {
    // Call backend API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
    const response = await axios.post(`${apiUrl}/financing/sunbit`, {
      applicant: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth,
        ssnLast4: data.ssn
      },
      transaction: {
        amount: data.procedureAmount,
        merchantId: 'PEDRO_DENTAL_SI'
      }
    });

    const result = response.data;

    // Sunbit typically approves 85% of applications
    return {
      approved: result.approved,
      provider: 'sunbit',
      approvalAmount: result.approvalAmount || data.procedureAmount,
      monthlyPayment: result.monthlyPayment,
      term: result.term || 12,
      apr: result.apr || 0,
      preQualificationId: result.preQualificationId,
      expirationDate: result.expirationDate,
      message: result.approved 
        ? `Congratulations! You're pre-qualified for up to $${result.approvalAmount} with Sunbit.`
        : 'Unable to pre-qualify with Sunbit at this time.'
    };
  }

  private async checkCherry(data: PatientFinancingData): Promise<FinancingResult> {
    // Call backend API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
    const response = await axios.post(`${apiUrl}/financing/cherry`, {
      patient: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        dateOfBirth: data.dateOfBirth
      },
      practice: {
        practiceId: 'PEDRO_DENTAL_001'
      },
      amount: data.procedureAmount
    });

    const result = response.data;

    // Handle direct application link response
    if (result.directApplication && result.applicationUrl) {
      return {
        approved: true,
        provider: 'cherry',
        approvalAmount: data.procedureAmount,
        monthlyPayment: this.calculateMonthlyPayment(data.procedureAmount, 12, 0),
        term: 12,
        apr: 0,
        applicationUrl: result.applicationUrl,
        message: result.message || 'Apply with Cherry - 60 second application!',
        features: result.features
      };
    }

    // Handle API response (when API docs are available)
    return {
      approved: result.approved,
      provider: 'cherry',
      approvalAmount: result.creditLimit,
      monthlyPayment: this.calculateMonthlyPayment(result.creditLimit, result.term, result.apr),
      term: result.term,
      apr: result.apr,
      preQualificationId: result.applicationId,
      expirationDate: result.expirationDate,
      message: result.approved 
        ? `Great news! Cherry approved you for $${result.creditLimit} in financing.`
        : 'Cherry financing not available for this amount.'
    };
  }

  private async checkCareCredit(data: PatientFinancingData): Promise<FinancingResult> {
    // CareCredit typically requires higher credit scores
    // This would integrate with their API
    const mockApproval = !!(data.income && data.income > 50000);

    return {
      approved: mockApproval,
      provider: 'carecredit',
      approvalAmount: mockApproval ? data.procedureAmount : 0,
      monthlyPayment: mockApproval ? this.calculateMonthlyPayment(data.procedureAmount, 24, 0) : 0,
      term: 24,
      apr: 0, // CareCredit often offers 0% promotional financing
      message: mockApproval 
        ? `You may qualify for CareCredit's promotional financing. Complete application required.`
        : 'CareCredit pre-qualification not available.'
    };
  }

  // Insurance Verification Methods

  async verifyInsurance(data: InsuranceVerificationData): Promise<InsuranceResult> {
    try {
      // Try Zuub first (integrated with many systems)
      const zuubResult = await this.verifyWithZuub(data);
      if (zuubResult.eligible) return zuubResult;

      // Fall back to pVerify if needed
      const pVerifyResult = await this.verifyWithPVerify(data);
      return pVerifyResult;
    } catch (error) {
      console.error('Insurance verification failed:', error);
      return {
        eligible: false,
        provider: data.insuranceProvider,
        message: 'Unable to verify insurance automatically. Our team will verify manually within 24 hours.'
      };
    }
  }

  private async verifyWithZuub(data: InsuranceVerificationData): Promise<InsuranceResult> {
    // Call backend API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
    const response = await axios.post(`${apiUrl}/insurance/zuub`, {
      patient: {
        firstName: data.patientFirstName,
        lastName: data.patientLastName,
        dob: data.patientDOB,
        memberId: data.memberId,
        groupNumber: data.groupNumber
      },
      provider: data.insuranceProvider,
      procedureCode: data.procedureCode || 'D6010' // Default to implant code
    });

    const result = response.data;

    return {
      eligible: result.eligible,
      provider: result.payerName,
      coveragePercentage: result.coveragePercentage,
      deductible: result.deductible,
      deductibleMet: result.deductibleMet,
      maxAnnualBenefit: result.annualMaximum,
      usedBenefit: result.usedBenefits,
      remainingBenefit: result.remainingBenefits,
      copay: result.copay,
      limitations: result.limitations || [],
      waitingPeriod: result.waitingPeriod,
      message: this.generateInsuranceMessage(result)
    };
  }

  private async verifyWithPVerify(data: InsuranceVerificationData): Promise<InsuranceResult> {
    // Call backend API endpoint
    const apiUrl = import.meta.env.VITE_API_URL || 'https://pedrobackend.onrender.com';
    const response = await axios.post(`${apiUrl}/insurance/pverify`, {
      subscriber: {
        firstName: data.patientFirstName,
        lastName: data.patientLastName,
        dob: data.patientDOB,
        memberId: data.memberId
      },
      provider: {
        npi: '1234567890', // Dr. Pedro's NPI
        taxId: '123456789'
      },
      payerId: this.getPayerId(data.insuranceProvider),
      serviceType: '39' // Dental
    });

    const result = response.data;

    return {
      eligible: result.isActive || false,
      provider: result.planName,
      coveragePercentage: result.coinsurancePercentage,
      deductible: result.deductibleAmount,
      deductibleMet: result.deductibleRemaining,
      maxAnnualBenefit: result.benefitMax,
      usedBenefit: result.benefitUsed,
      remainingBenefit: result.benefitRemaining,
      copay: result.copayAmount,
      limitations: result.serviceRestrictions || [],
      waitingPeriod: result.hasWaitingPeriod,
      message: this.generateInsuranceMessage(result)
    };
  }

  // Helper Methods

  private calculateMonthlyPayment(principal: number, term: number, apr: number): number {
    if (apr === 0) return principal / term;
    
    const monthlyRate = apr / 100 / 12;
    const payment = principal * (monthlyRate * Math.pow(1 + monthlyRate, term)) / 
                   (Math.pow(1 + monthlyRate, term) - 1);
    
    return Math.round(payment * 100) / 100;
  }

  private generateInsuranceMessage(result: any): string {
    if (!result.eligible) {
      return 'Insurance coverage could not be verified. Please contact our office for assistance.';
    }

    const coverage = result.coveragePercentage || 0;
    const remaining = result.remainingBenefits || 0;
    const deductibleLeft = result.deductible - result.deductibleMet;

    let message = `✓ Your ${result.payerName || 'insurance'} is active. `;
    
    if (coverage > 0) {
      message += `Coverage: ${coverage}% after deductible. `;
    }
    
    if (remaining > 0) {
      message += `$${remaining} remaining in benefits. `;
    }
    
    if (deductibleLeft > 0) {
      message += `$${deductibleLeft} deductible remaining. `;
    }

    if (result.waitingPeriod) {
      message += '⚠️ Waiting period may apply. ';
    }

    return message;
  }

  private getPayerId(provider: string): string {
    // Map common insurance names to payer IDs
    const payerMap: Record<string, string> = {
      'delta dental': 'DELTA',
      'cigna': 'CIGNA',
      'aetna': 'AETNA',
      'united healthcare': 'UNITEDHEALTHCARE',
      'metlife': 'METLIFE',
      'guardian': 'GUARDIAN',
      'humana': 'HUMANA'
    };

    return payerMap[provider.toLowerCase()] || provider.toUpperCase();
  }

  // Estimate out-of-pocket cost
  estimatePatientCost(
    procedureCost: number, 
    insurance: InsuranceResult
  ): { estimatedCost: number; breakdown: string } {
    if (!insurance.eligible) {
      return {
        estimatedCost: procedureCost,
        breakdown: 'Full amount (no insurance coverage verified)'
      };
    }

    let patientCost = procedureCost;
    let breakdown = '';

    // Apply deductible first
    const deductibleRemaining = (insurance.deductible || 0) - (insurance.deductibleMet || 0);
    if (deductibleRemaining > 0) {
      const deductiblePortion = Math.min(deductibleRemaining, procedureCost);
      patientCost = deductiblePortion;
      breakdown += `Deductible: $${deductiblePortion}\n`;
      
      // Calculate covered amount after deductible
      const afterDeductible = procedureCost - deductiblePortion;
      if (afterDeductible > 0 && insurance.coveragePercentage) {
        const insurancePays = afterDeductible * (insurance.coveragePercentage / 100);
        const patientPays = afterDeductible - insurancePays;
        patientCost += patientPays;
        breakdown += `Coinsurance (${100 - insurance.coveragePercentage}%): $${patientPays}\n`;
      }
    } else if (insurance.coveragePercentage) {
      // No deductible remaining
      const insurancePays = procedureCost * (insurance.coveragePercentage / 100);
      patientCost = procedureCost - insurancePays;
      breakdown += `Your portion (${100 - insurance.coveragePercentage}%): $${patientCost}\n`;
    }

    // Check if exceeds remaining benefits
    if (insurance.remainingBenefit && insurance.remainingBenefit < procedureCost) {
      breakdown += `⚠️ Procedure may exceed remaining benefits of $${insurance.remainingBenefit}`;
    }

    return {
      estimatedCost: Math.round(patientCost * 100) / 100,
      breakdown: breakdown.trim()
    };
  }
}

export const financingService = new FinancingService();