package band.config;

import com.pcbsys.nirvana.client.nSession;
import com.pcbsys.nirvana.client.nSessionAttributes;
import com.pcbsys.nirvana.client.nSessionFactory;
import com.pcbsys.nirvana.nAdminAPI.nRealmNode;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class MainConfig {
    String realmAddress = "nhp://localhost:11000";

    @Bean
    nSession session() throws Exception
    {
        nSessionAttributes sessionAttr = new nSessionAttributes(realmAddress);
        nSession session = nSessionFactory.create(sessionAttr);

        session.init();

        return session;
    }

    @Bean
    nRealmNode realmNode() throws Exception
    {
        nSessionAttributes sessionAttr = new nSessionAttributes(realmAddress);

        nRealmNode realmNode = new nRealmNode(sessionAttr);
        realmNode.waitForEntireNameSpace();

        return realmNode;
    }
}
