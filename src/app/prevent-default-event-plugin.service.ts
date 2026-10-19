import { Injectable, Injector } from '@angular/core';
import { EventManagerPlugin } from '@angular/platform-browser';

@Injectable()
export class PreventDefaultEventPlugin extends EventManagerPlugin {
  constructor(private injector: Injector) {
    super(injector.get(EventManagerPlugin as any, null));
  }

  override supports(eventName: string): boolean {
    return eventName.endsWith('.prevent');
  }

  override addEventListener(element: HTMLElement, eventName: string, handler: Function): Function {
    const originalEvent = eventName.split('.')[0];

    return this.manager.addEventListener(
      element,
      originalEvent,
      (event: Event) => {
        event.preventDefault(); // we are adding prevent default in order to make the form stable
            handler(event);     // and avoid the form to be getting being reload
      }
    );
  }
}