/*jshint expr:true, supernew:true, loopfunc:true, curly:false*/
"use strict";

/*
========================================
Meteor is licensed under the MIT License
========================================

Copyright (C) 2011--2012 Meteor Development Group

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
*/
(function () {
  var Meteor = {};

  var pending_invalidate = [];
  var next_id = 1;

  var Context = function () {
    // Each context has a unique number. You can use this to avoid
    // storing multiple copies of the same context in your
    // invalidation list. The id is an integer >= 1.
    this.id = next_id++;
    this._callbacks = [];
    this._invalidated = false;
  };
  Context.current = null;

  _.extend(Context.prototype, {
    run: function (f) {
      var previous = Context.current;
      Context.current = this;
      try { return f(); }
      finally { Context.current = previous; }
    },

    // we specifically guarantee that this doesn't call any
    // invalidation functions (before returning) -- it just marks the
    // context as invalidated.
    invalidate: function () {
      if (!this._invalidated) {
        this._invalidated = true;
        // If this is first invalidation, schedule a flush.
        // We may be inside a flush already, in which case this
        // is unnecessary but harmless.
        if (!pending_invalidate.length)
          setTimeout(Meteor.flush, 0);
        pending_invalidate.push(this);
      }
    },

    // calls f immediately if this context was already
    // invalidated. receives one argument, the context.
    onInvalidate: function (f) {
      if (this._invalidated)
        f(this);
      else
        this._callbacks.push(f);
    }
  });

  _.extend(Meteor, {
    // XXX specify what happens when flush calls flush. eg, flushing
    // causes a dom update, which causes onblur, which invokes an
    // event handler that calls flush. it's probably an exception --
    // no flushing from inside onblur. can also imagine routing onblur
    // through settimeout(0), which is probably what the user wants.
    // https://app.asana.com/0/159908330244/385138233856
    flush: function () {
      while (pending_invalidate.length) {
        var pending = pending_invalidate;
        pending_invalidate = [];

        _.each(pending, function (ctx) {
          _.each(ctx._callbacks, function (f) {
            try {
              f(ctx);
            } catch (e) {
              Meteor._debug("Exception from Meteor.flush:", e.stack);
            }
          });
          delete ctx._callbacks; // maybe help the GC
        });
      }
    },

    deps: {
      Context: Context
    }
  });

  B._deps = Meteor.deps;
})();
