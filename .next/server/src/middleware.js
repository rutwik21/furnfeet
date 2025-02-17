"use strict";
(() => {
var exports = {};
exports.id = 727;
exports.ids = [727,888,660];
exports.modules = {

/***/ 46154:
/***/ ((__unused_webpack_module, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  config: () => (/* binding */ config),
  "default": () => (/* binding */ next_route_loaderkind_PAGES_page_src_2Fmiddleware_preferredRegion_absolutePagePath_private_next_root_dir_2Fsrc_2Fmiddleware_ts_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_),
  getServerSideProps: () => (/* binding */ getServerSideProps),
  getStaticPaths: () => (/* binding */ getStaticPaths),
  getStaticProps: () => (/* binding */ getStaticProps),
  reportWebVitals: () => (/* binding */ reportWebVitals),
  routeModule: () => (/* binding */ routeModule),
  unstable_getServerProps: () => (/* binding */ unstable_getServerProps),
  unstable_getServerSideProps: () => (/* binding */ unstable_getServerSideProps),
  unstable_getStaticParams: () => (/* binding */ unstable_getStaticParams),
  unstable_getStaticPaths: () => (/* binding */ unstable_getStaticPaths),
  unstable_getStaticProps: () => (/* binding */ unstable_getStaticProps)
});

// NAMESPACE OBJECT: ./src/middleware.ts
var middleware_namespaceObject = {};
__webpack_require__.r(middleware_namespaceObject);
__webpack_require__.d(middleware_namespaceObject, {
  middleware: () => (middleware)
});

// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-modules/pages/module.compiled.js
var module_compiled = __webpack_require__(87093);
// EXTERNAL MODULE: ./node_modules/next/dist/server/future/route-kind.js
var route_kind = __webpack_require__(35244);
// EXTERNAL MODULE: ./node_modules/next/dist/build/templates/helpers.js
var helpers = __webpack_require__(1323);
// EXTERNAL MODULE: ./node_modules/next/dist/pages/_document.js
var _document = __webpack_require__(28676);
var _document_default = /*#__PURE__*/__webpack_require__.n(_document);
// EXTERNAL MODULE: ./node_modules/next/dist/pages/_app.js
var _app = __webpack_require__(2840);
var _app_default = /*#__PURE__*/__webpack_require__.n(_app);
// EXTERNAL MODULE: ./node_modules/next/dist/server/web/exports/next-response.js
var next_response = __webpack_require__(20746);
;// CONCATENATED MODULE: ./src/lib/payload-utils.ts
const getServerSideUser = async (cookies)=>{
    const token = cookies.get("payload-token")?.value;
    const meRes = await fetch(`${"http://localhost:3000"}/api/users/me`, {
        headers: {
            Authorization: `JWT ${token}`
        }
    });
    const { user } = await meRes.json();
    return {
        user
    };
};

;// CONCATENATED MODULE: ./src/middleware.ts


async function middleware(req) {
    const { nextUrl, cookies } = req;
    const { user } = await getServerSideUser(cookies);
    if (user && [
        "/sign-in",
        "/sign-up"
    ].includes(nextUrl.pathname)) {
        return next_response/* default */.Z.redirect(`${"http://localhost:3000"}/`);
    }
    return next_response/* default */.Z.next();
}

;// CONCATENATED MODULE: ./node_modules/next/dist/build/webpack/loaders/next-route-loader/index.js?kind=PAGES&page=src%2Fmiddleware&preferredRegion=&absolutePagePath=private-next-root-dir%2Fsrc%2Fmiddleware.ts&absoluteAppPath=next%2Fdist%2Fpages%2F_app&absoluteDocumentPath=next%2Fdist%2Fpages%2F_document&middlewareConfigBase64=e30%3D!



// Import the app and document modules.


// Import the userland code.

// Re-export the component (should be the default export).
/* harmony default export */ const next_route_loaderkind_PAGES_page_src_2Fmiddleware_preferredRegion_absolutePagePath_private_next_root_dir_2Fsrc_2Fmiddleware_ts_absoluteAppPath_next_2Fdist_2Fpages_2F_app_absoluteDocumentPath_next_2Fdist_2Fpages_2F_document_middlewareConfigBase64_e30_3D_ = ((0,helpers/* hoist */.l)(middleware_namespaceObject, "default"));
// Re-export methods.
const getStaticProps = (0,helpers/* hoist */.l)(middleware_namespaceObject, "getStaticProps");
const getStaticPaths = (0,helpers/* hoist */.l)(middleware_namespaceObject, "getStaticPaths");
const getServerSideProps = (0,helpers/* hoist */.l)(middleware_namespaceObject, "getServerSideProps");
const config = (0,helpers/* hoist */.l)(middleware_namespaceObject, "config");
const reportWebVitals = (0,helpers/* hoist */.l)(middleware_namespaceObject, "reportWebVitals");
// Re-export legacy methods.
const unstable_getStaticProps = (0,helpers/* hoist */.l)(middleware_namespaceObject, "unstable_getStaticProps");
const unstable_getStaticPaths = (0,helpers/* hoist */.l)(middleware_namespaceObject, "unstable_getStaticPaths");
const unstable_getStaticParams = (0,helpers/* hoist */.l)(middleware_namespaceObject, "unstable_getStaticParams");
const unstable_getServerProps = (0,helpers/* hoist */.l)(middleware_namespaceObject, "unstable_getServerProps");
const unstable_getServerSideProps = (0,helpers/* hoist */.l)(middleware_namespaceObject, "unstable_getServerSideProps");
// Create and export the route module that will be consumed.
const routeModule = new module_compiled.PagesRouteModule({
    definition: {
        kind: route_kind/* RouteKind */.x.PAGES,
        page: "/src/middleware",
        pathname: "src/middleware",
        // The following aren't used in production.
        bundlePath: "",
        filename: ""
    },
    components: {
        App: (_app_default()),
        Document: (_document_default())
    },
    userland: middleware_namespaceObject
});

//# sourceMappingURL=pages.js.map

/***/ }),

/***/ 62785:
/***/ ((module) => {

module.exports = require("next/dist/compiled/next-server/pages.runtime.prod.js");

/***/ }),

/***/ 16689:
/***/ ((module) => {

module.exports = require("react");

/***/ }),

/***/ 71017:
/***/ ((module) => {

module.exports = require("path");

/***/ })

};
;

// load runtime
var __webpack_require__ = require("../webpack-runtime.js");
__webpack_require__.C(exports);
var __webpack_exec__ = (moduleId) => (__webpack_require__(__webpack_require__.s = moduleId))
var __webpack_exports__ = __webpack_require__.X(0, [310,676,840,450,746], () => (__webpack_exec__(46154)));
module.exports = __webpack_exports__;

})();