declare global {
  interface Window {
    dataLayer: Record<string, unknown>[];
  }
}

type EventParams = Record<string, string | number | boolean | null | undefined>;

export function pushEvent(eventName: string, params?: EventParams) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: eventName,
    ...params,
  });
}

export function pushPageView(pageName: string, pageUrl: string) {
  pushEvent('page_view', {
    page_name: pageName,
    page_url: pageUrl,
  });
}

export function trackCTAClick(ctaName: string, ctaLocation: string) {
  pushEvent('cta_click', {
    cta_name: ctaName,
    cta_location: ctaLocation,
  });
}

export function trackSectionView(sectionName: string) {
  pushEvent('section_view', {
    section_name: sectionName,
  });
}

export function trackPackSelect(packName: string, packPrice: number) {
  pushEvent('pack_select', {
    pack_name: packName,
    pack_price: packPrice,
  });
}

export function trackFormStart(formName: string) {
  pushEvent('form_start', {
    form_name: formName,
  });
}

export function trackFormStep(formName: string, stepNumber: number, stepName: string) {
  pushEvent('form_step', {
    form_name: formName,
    step_number: stepNumber,
    step_name: stepName,
  });
}

export function trackFormSubmit(formName: string, formData?: EventParams) {
  pushEvent('form_submit', {
    form_name: formName,
    ...formData,
  });
}

export function trackFormError(formName: string, errorMessage: string) {
  pushEvent('form_error', {
    form_name: formName,
    error_message: errorMessage,
  });
}

export function trackProjectClick(projectName: string, projectUrl: string) {
  pushEvent('project_click', {
    project_name: projectName,
    project_url: projectUrl,
  });
}

export function trackFAQOpen(question: string) {
  pushEvent('faq_open', {
    question: question,
  });
}

export function trackPhoneClick() {
  pushEvent('phone_click', {
    action: 'call',
  });
}

export function trackEmailClick() {
  pushEvent('email_click', {
    action: 'email',
  });
}

export function trackScrollDepth(percentage: number) {
  pushEvent('scroll_depth', {
    scroll_percentage: percentage,
  });
}

export function setUserProperties(properties: EventParams) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: 'user_properties',
    user_properties: properties,
  });
}
