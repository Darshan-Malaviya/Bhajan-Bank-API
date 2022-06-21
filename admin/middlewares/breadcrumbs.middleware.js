

export const getBreadcrumbs = (req, res, next) => {
    const urls = req.originalUrl.split('/');
    if (urls[urls.length - 1] === '') {
        urls.pop();
    }
    urls.shift();
    req.breadcrumbs = urls.map((url, i) => {
        return {
            breadcrumbName: (url === '' ? 'Home' : url.charAt(0).toUpperCase() + url.slice(1)),
            breadcrumbUrl: `/${urls.slice(0, i + 1).join('/')}`,
        };
    });
    req.app.locals.breadcrumbs = req.breadcrumbs;
    next();
}