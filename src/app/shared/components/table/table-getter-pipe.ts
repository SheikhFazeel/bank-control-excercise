import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'dataGetterPipe'
})
export class DataGetterPipe implements PipeTransform {

    transform(object: any, keyName: string, ...args: unknown[]): unknown {
        if (keyName.split('.').length > 1) {
            return this.getNestedPropertyValue(object, keyName);
        }
        return object[keyName];
    }

    getNestedPropertyValue(theObject: any, path: string, separator = '.'): string {
        try {
            separator = separator || '.';
            return path.replace('[', separator).replace(']', '').split(separator).reduce(function (obj, property) {
                return obj[property];
            }, theObject);
        } catch (err) {
            return '';
        }
    }

}
