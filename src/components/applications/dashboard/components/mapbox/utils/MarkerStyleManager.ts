export class MarkerStyleManager {
  static updateMarkerStyle(el: HTMLElement, isSelected: boolean): void {
    if (!document.body.contains(el)) {
      console.error('❌ Cannot update style - marker element not in DOM:', {
        markerId: el.id,
        timestamp: new Date().toISOString()
      });
      return;
    }

    console.log('🎨 Updating marker style:', {
      markerId: el.id,
      isSelected,
      timestamp: new Date().toISOString()
    });

    el.style.width = isSelected ? '24px' : '16px';
    el.style.height = isSelected ? '24px' : '16px';
    el.style.backgroundColor = isSelected ? '#dc2626' : '#2563eb';
  }
}