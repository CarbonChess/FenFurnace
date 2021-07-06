declare var global: any;
declare var window: any;
if (typeof global === 'undefined') global = {};
import exported from './index';
if (typeof window !== "undefined") window.fenFuncs = exported;
