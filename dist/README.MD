# angular-gantt


## How to include angular-gantt


```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { GanttModule } from 'angular-gantt';

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
<!-- You can now use the gantt-component in for example app.component.html -->
<h1>
  {{title}}
</h1>
<gantt-component></gantt-component>
```

## Development

To generate all `*.js`, `*.d.ts` and `*.metadata.json` files:

```bash
$ npm run build
```

To lint all `*.ts` files:

```bash
$ npm run lint
```

## License

MIT © [niikoo](mailto:post@niikoo.net)
MIT © [joerg.wiesmann](mailto:joerg.wiesmann@gmail.com)
