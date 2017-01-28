package band.config;

import com.pcbsys.nirvana.client.nSession;
import com.pcbsys.nirvana.client.nSessionAttributes;
import com.pcbsys.nirvana.client.nSessionFactory;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig {
    @Bean
    nSession session() throws Exception
    {
        nSessionAttributes sessionAttr = new nSessionAttributes("nhp://localhost:11000");
        nSession session = nSessionFactory.create(sessionAttr);

        session.init();

        return session;
    }
}
