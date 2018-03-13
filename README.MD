# ngx-gantt - Gantt chart for Angular 5

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import the module
import { GanttModule } from 'ngx-gantt';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    // Import the Gantt module
    GanttModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

```xml
<!-- You can now use the gantt-component in templates like this: -->
<h1>
  {{title}}
</h1>
<gantt-component></gantt-component>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ yarn build
```

To lint all `*.ts` files:

```bash
$ yarn run lint
```

## License

MIT © [niikoo](mailto:post@niikoo.net)

Based on angular4-gantt by [joerg.wiesmann](mailto:joerg.wiesmann@gmail.com)
