package net.bitnine.agensbrowser.bundle.config;

import javax.servlet.http.HttpServletRequest;


public class SecurityUtil {

    public static String getClientIP(HttpServletRequest request) {
        String xfHeader = request.getHeader("X-Forwarded-For");
        if (xfHeader == null) {
            return request.getRemoteAddr();
        }
        return xfHeader.split(",")[0];
    }
}