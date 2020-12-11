import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';

export class CustomValidators {
    static passwordConforming(control: FormControl): Promise<any> | Observable<any> {
        let pass = control.parent.value.password;
        let repPass = control.value;
       const promise = new Promise<any>((resolve, reject) => {
        if (pass !== repPass) {
            resolve({'passwordsNotMatch': true})
        } else {
            resolve(null);
        }
       })
        return promise
    }
}