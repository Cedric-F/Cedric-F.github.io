/* feedreader.js
 *
 * This is the spec file that Jasmine will read and contains
 * all of the tests that will be run against your application.
 */

/* We're placing all of our tests within the $() function,
 * since some of these tests may require DOM elements. We want
 * to ensure they don't run until the DOM is ready.
 */
$(
  (function() {
    describe("RSS Feeds", () => {

      it("are defined", () => {
        expect(allFeeds).toBeDefined();
        expect(allFeeds.length).not.toBe(0);
      });

      /*
       * Loop over the feeds and see if they have a declared url and name.
       * If it has, check their boolean value. An empty string evaluates to false.
       */

      it("have a defined and valid url", () =>
        allFeeds.forEach(feed => {
          expect(feed.url).toBeDefined();
          expect(Boolean(feed.url)).toBe(true);
        }));

      it("have a defined and valid name", () =>
        allFeeds.forEach(feed => {
          expect(feed.name).toBeDefined();
          expect(Boolean(feed.name)).toBe(true);
        }));
    });

    describe("The menu", () => {

      let body = $("body"),
          icon = $(".menu-icon-link");

      it("should be hidden by default", () =>
        expect(body.hasClass("menu-hidden")).toBe(true));

      it("'s visibility should change when the icon is clicked", () => {
        /*
         * Verify the class existence after a click on the icon
         */
        icon.click(); // show
        expect(body.hasClass("menu-hidden")).toBe(false);

        icon.click(); // hide
        expect(body.hasClass("menu-hidden")).toBe(true);
      });
    });

    describe("Initial Entries", () => {

      beforeEach(done => loadFeed(0, done));

      /*
       * When the content is loaded, check if there is any element with the "entry" class
       */

      it("should have at least an element within the feed container", () =>
        expect($(".feed .entry")).toBeDefined());
    });

    describe("New Feed Selection", () => {
      let oldFeed;
      /*
       * Before the test, store the current feed content, and update it with the new one
       */
      beforeEach(done =>
        loadFeed(0, () => {
          oldFeed = $(".feed").html();
          loadFeed(1, done);
        })
      );

      /*
       * Compare the previous feed with the new one
       */
      it("should change when a new feed is loaded", done => {
        expect(oldFeed).not.toBe($(".feed").html());
        done();
      });
    });
  })()
);
